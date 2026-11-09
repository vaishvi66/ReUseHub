from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from app.database import users_collection
from app.middleware.auth import get_current_user
from app.schemas.user import ProfileUpdate, UserOut
from app.utils.objectid import serialize_id, to_object_id

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
async def update_profile(payload: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if updates:
        updates["updated_at"] = datetime.now(timezone.utc)
        await users_collection.update_one({"_id": to_object_id(current_user["id"])}, {"$set": updates})

    user = await users_collection.find_one({"_id": to_object_id(current_user["id"])})
    return serialize_id(user)
