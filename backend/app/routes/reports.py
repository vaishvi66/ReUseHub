from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import items_collection, reports_collection, users_collection
from app.middleware.auth import get_current_student
from app.schemas.report import ReportCreate, ReportOut
from app.utils.objectid import serialize_id, to_object_id

router = APIRouter(prefix="/reports", tags=["reports"])


async def _enrich(report: dict) -> dict:
    reporter = await users_collection.find_one({"_id": to_object_id(report["reported_by"])})
    report["reported_by_name"] = reporter["full_name"] if reporter else None
    if report.get("reported_item_id"):
        item = await items_collection.find_one({"_id": to_object_id(report["reported_item_id"])})
        report["reported_item_name"] = item["name"] if item else None
    return report


@router.post("", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
async def create_report(payload: ReportCreate, current_user: dict = Depends(get_current_student)):
    if not payload.reported_user_id and not payload.reported_item_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Must report either a user or an item")

    now = datetime.now(timezone.utc)
    doc = {
        "reported_by": current_user["id"],
        "reported_user_id": payload.reported_user_id,
        "reported_item_id": payload.reported_item_id,
        "reason": payload.reason,
        "description": payload.description,
        "status": "pending",
        "created_at": now,
        "updated_at": now,
    }
    result = await reports_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return serialize_id(await _enrich(doc))


@router.get("/mine", response_model=list[ReportOut])
async def my_reports(current_user: dict = Depends(get_current_student)):
    reports = await reports_collection.find({"reported_by": current_user["id"]}).sort("created_at", -1).to_list(length=200)
    return [serialize_id(await _enrich(r)) for r in reports]
