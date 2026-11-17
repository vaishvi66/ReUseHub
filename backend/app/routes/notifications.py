from fastapi import APIRouter, Depends

from app.middleware.auth import get_current_student
from app.patterns.observer import notifications_collection
from app.utils.objectid import serialize_id

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("/mine")
async def my_notifications(current_user: dict = Depends(get_current_student)):
    notes = (
        await notifications_collection.find({"recipient_id": current_user["id"]})
        .sort("created_at", -1)
        .to_list(length=100)
    )
    return [serialize_id(n) for n in notes]
