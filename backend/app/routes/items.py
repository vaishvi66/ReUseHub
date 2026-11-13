import re
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status

from app.database import categories_collection, items_collection, requests_collection, users_collection
from app.middleware.auth import get_current_student
from app.schemas.item import Condition, ItemOut, ListingType
from app.utils.objectid import serialize_id, to_object_id
from app.utils.uploads import save_item_image

router = APIRouter(prefix="/items", tags=["items"])


async def _attach_owner_name(item: dict) -> dict:
    if not item:
        return item
    if "owner_id" in item:
        try:
            owner = await users_collection.find_one({"_id": to_object_id(item["owner_id"])})
            item["owner_name"] = owner.get("full_name") if owner else None
        except Exception:
            item["owner_name"] = None
    if "category_id" in item:
        try:
            cat = await categories_collection.find_one({"_id": to_object_id(item["category_id"])})
            item["category_name"] = cat.get("name") if cat else None
        except Exception:
            item["category_name"] = None
    return item


def _validate_listing_fields(listing_type: str, price: Optional[float], exchange_requirement: Optional[str]):
    if listing_type == "sell":
        if price is None or price <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Price is required for items listed for sale",
            )
    else:
        price = None

    if listing_type == "exchange" and not exchange_requirement:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Exchange requirement is required for exchange listings",
        )
    if listing_type != "exchange":
        exchange_requirement = None

    return price, exchange_requirement


@router.get("", response_model=list[ItemOut])
async def browse_items(
    search: Optional[str] = None,
    category_id: Optional[str] = None,
    listing_type: Optional[ListingType] = None,
    condition: Optional[Condition] = None,
):
    query: dict = {"approval_status": "approved"}
    if category_id:
        query["category_id"] = category_id
    if listing_type:
        query["listing_type"] = listing_type
    if condition:
        query["condition"] = condition
    if search and search.strip():
        safe_search = re.escape(search.strip())
        query["$or"] = [
            {"name": {"$regex": safe_search, "$options": "i"}},
            {"description": {"$regex": safe_search, "$options": "i"}},
        ]

    items = await items_collection.find(query).sort("created_at", -1).to_list(length=200)
    return [await _attach_owner_name(serialize_id(i)) for i in items]


@router.get("/mine", response_model=list[ItemOut])
async def my_items(current_user: dict = Depends(get_current_student)):
    items = await items_collection.find({"owner_id": current_user["id"]}).sort("created_at", -1).to_list(length=200)
    return [await _attach_owner_name(serialize_id(i)) for i in items]


@router.get("/{item_id}", response_model=ItemOut)
async def get_item(item_id: str):
    item = await items_collection.find_one({"_id": to_object_id(item_id)})
    if not item or item["approval_status"] != "approved":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return await _attach_owner_name(serialize_id(item))


@router.post("", response_model=ItemOut, status_code=status.HTTP_201_CREATED)
async def create_item(
    name: str = Form(..., min_length=2, max_length=120),
    description: str = Form(..., min_length=1, max_length=2000),
    category_id: str = Form(...),
    listing_type: ListingType = Form(...),
    condition: Condition = Form(...),
    location: str = Form(..., min_length=1, max_length=150),
    price: Optional[float] = Form(None),
    exchange_requirement: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_student),
):
    category = await categories_collection.find_one({"_id": to_object_id(category_id)})
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")

    price, exchange_requirement = _validate_listing_fields(listing_type, price, exchange_requirement)

    image_url = None
    if image is not None and image.filename:
        image_url = await save_item_image(image)

    now = datetime.now(timezone.utc)
    doc = {
        "name": name,
        "description": description,
        "category_id": category_id,
        "listing_type": listing_type,
        "price": price,
        "condition": condition,
        "image_url": image_url,
        "location": location,
        "exchange_requirement": exchange_requirement,
        "owner_id": current_user["id"],
        "approval_status": "pending",
        "availability_status": "available",
        "created_at": now,
        "updated_at": now,
    }
    result = await items_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return await _attach_owner_name(serialize_id(doc))


@router.put("/{item_id}", response_model=ItemOut)
async def update_item(
    item_id: str,
    name: str = Form(..., min_length=2, max_length=120),
    description: str = Form(..., min_length=1, max_length=2000),
    category_id: str = Form(...),
    listing_type: ListingType = Form(...),
    condition: Condition = Form(...),
    location: str = Form(..., min_length=1, max_length=150),
    price: Optional[float] = Form(None),
    exchange_requirement: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    current_user: dict = Depends(get_current_student),
):
    oid = to_object_id(item_id)
    item = await items_collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only edit your own listings")
    if item["availability_status"] != "available":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only available listings can be edited")

    category = await categories_collection.find_one({"_id": to_object_id(category_id)})
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category")

    price, exchange_requirement = _validate_listing_fields(listing_type, price, exchange_requirement)

    updates = {
        "name": name,
        "description": description,
        "category_id": category_id,
        "listing_type": listing_type,
        "price": price,
        "condition": condition,
        "location": location,
        "exchange_requirement": exchange_requirement,
        "approval_status": "pending",
        "updated_at": datetime.now(timezone.utc),
    }
    if image is not None and image.filename:
        updates["image_url"] = await save_item_image(image)

    await items_collection.update_one({"_id": oid}, {"$set": updates})
    updated = await items_collection.find_one({"_id": oid})
    return await _attach_owner_name(serialize_id(updated))


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: str, current_user: dict = Depends(get_current_student)):
    oid = to_object_id(item_id)
    item = await items_collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete your own listings")
    if item["availability_status"] != "available":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only available listings can be deleted")

    await items_collection.delete_one({"_id": oid})
    await requests_collection.delete_many({"item_id": item_id, "status": "pending"})


@router.post("/{item_id}/request", status_code=status.HTTP_201_CREATED)
async def request_item(
    item_id: str,
    request: Request,
    current_user: dict = Depends(get_current_student),
):
    note = None
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            body = await request.json()
            note = body.get("note") if isinstance(body, dict) else None
        except Exception:
            note = None
    else:
        try:
            form = await request.form()
            note = form.get("note")
        except Exception:
            note = None

    oid = to_object_id(item_id)
    item = await items_collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    if item["owner_id"] == current_user["id"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot request your own item")
    if item["approval_status"] != "approved" or item["availability_status"] != "available":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This item is not available for request")

    existing = await requests_collection.find_one(
        {"item_id": item_id, "requester_id": current_user["id"], "status": "pending"}
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already have a pending request for this item")

    now = datetime.now(timezone.utc)
    doc = {
        "item_id": item_id,
        "requester_id": current_user["id"],
        "owner_id": item["owner_id"],
        "status": "pending",
        "note": note,
        "pickup_location": None,
        "pickup_date": None,
        "pickup_time": None,
        "created_at": now,
        "updated_at": now,
    }
    result = await requests_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_id(doc)
