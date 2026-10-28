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


