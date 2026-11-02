from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import items_collection, requests_collection, users_collection
from app.middleware.auth import get_current_student
from app.schemas.request import PickupSchedule, RequestOut
from app.utils.objectid import serialize_id, to_object_id

router = APIRouter(prefix="/requests", tags=["requests"])


