from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import categories_collection, items_collection
from app.middleware.auth import get_current_admin
from app.schemas.category import CategoryCreate, CategoryOut, CategoryUpdate
from app.utils.objectid import serialize_id, to_object_id

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryOut])
async def list_categories():
    categories = await categories_collection.find().sort("name", 1).to_list(length=200)
    return [serialize_id(c) for c in categories]


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(payload: CategoryCreate, admin: dict = Depends(get_current_admin)):
    existing = await categories_collection.find_one({"name": payload.name})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category already exists")

    doc = {"name": payload.name, "created_at": datetime.now(timezone.utc)}
    result = await categories_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_id(doc)


@router.put("/{category_id}", response_model=CategoryOut)
async def update_category(category_id: str, payload: CategoryUpdate, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(category_id)
    await categories_collection.update_one({"_id": oid}, {"$set": {"name": payload.name}})
    category = await categories_collection.find_one({"_id": oid})
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return serialize_id(category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: str, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(category_id)
    in_use = await items_collection.find_one({"category_id": category_id})
    if in_use:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category is in use by existing items and cannot be deleted",
        )
    result = await categories_collection.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

