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


