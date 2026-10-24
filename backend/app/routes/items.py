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

