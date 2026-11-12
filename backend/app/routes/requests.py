from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import items_collection, requests_collection, users_collection
from app.middleware.auth import get_current_student
from app.schemas.request import PickupSchedule, RequestOut
from app.utils.objectid import serialize_id, to_object_id

router = APIRouter(prefix="/requests", tags=["requests"])


async def _enrich(req: dict) -> dict:
    item = await items_collection.find_one({"_id": to_object_id(req["item_id"])})
    req["item_name"] = item["name"] if item else None
    requester = await users_collection.find_one({"_id": to_object_id(req["requester_id"])})
    req["requester_name"] = requester["full_name"] if requester else None
    owner = await users_collection.find_one({"_id": to_object_id(req["owner_id"])})
    req["owner_name"] = owner["full_name"] if owner else None
    return req


async def _get_owned_request(request_id: str, current_user: dict) -> dict:
    oid = to_object_id(request_id)
    req = await requests_collection.find_one({"_id": oid})
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    if req["requester_id"] != current_user["id"] and req["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized for this request")
    return req


@router.get("", response_model=list[RequestOut])
async def list_requests(type: Optional[str] = Query(None, pattern="^(incoming|outgoing)$"), current_user: dict = Depends(get_current_student)):
    if type == "incoming":
        query = {"owner_id": current_user["id"]}
    elif type == "outgoing":
        query = {"requester_id": current_user["id"]}
    else:
        query = {"$or": [{"owner_id": current_user["id"]}, {"requester_id": current_user["id"]}]}

    reqs = await requests_collection.find(query).sort("created_at", -1).to_list(length=200)
    return [serialize_id(await _enrich(r)) for r in reqs]


@router.get("/{request_id}", response_model=RequestOut)
async def get_request(request_id: str, current_user: dict = Depends(get_current_student)):
    req = await _get_owned_request(request_id, current_user)
    return serialize_id(await _enrich(req))


@router.put("/{request_id}/accept", response_model=RequestOut)
async def accept_request(request_id: str, current_user: dict = Depends(get_current_student)):
    oid = to_object_id(request_id)
    req = await requests_collection.find_one({"_id": oid})
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    if req["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the item owner can accept requests")
    if req["status"] != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only pending requests can be accepted")

    now = datetime.now(timezone.utc)
    await requests_collection.update_one({"_id": oid}, {"$set": {"status": "accepted", "updated_at": now}})
    await requests_collection.update_many(
        {"item_id": req["item_id"], "status": "pending", "_id": {"$ne": oid}},
        {"$set": {"status": "rejected", "updated_at": now}},
    )
    await items_collection.update_one(
        {"_id": to_object_id(req["item_id"])}, {"$set": {"availability_status": "reserved", "updated_at": now}}
    )

    req = await requests_collection.find_one({"_id": oid})
    return serialize_id(await _enrich(req))


@router.put("/{request_id}/reject", response_model=RequestOut)
async def reject_request(request_id: str, current_user: dict = Depends(get_current_student)):
    oid = to_object_id(request_id)
    req = await requests_collection.find_one({"_id": oid})
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    if req["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the item owner can reject requests")
    if req["status"] != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only pending requests can be rejected")

    await requests_collection.update_one(
        {"_id": oid}, {"$set": {"status": "rejected", "updated_at": datetime.now(timezone.utc)}}
    )
    req = await requests_collection.find_one({"_id": oid})
    return serialize_id(await _enrich(req))


@router.put("/{request_id}/pickup", response_model=RequestOut)
async def schedule_pickup(request_id: str, payload: PickupSchedule, current_user: dict = Depends(get_current_student)):
    oid = to_object_id(request_id)
    req = await requests_collection.find_one({"_id": oid})
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    if req["owner_id"] != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the item owner can schedule pickup")
    if req["status"] != "accepted":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request must be accepted before scheduling pickup")

    await requests_collection.update_one(
        {"_id": oid},
        {
            "$set": {
                "status": "pickup_scheduled",
                "pickup_location": payload.pickup_location,
                "pickup_date": payload.pickup_date.isoformat(),
                "pickup_time": payload.pickup_time.isoformat(timespec="minutes"),
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    req = await requests_collection.find_one({"_id": oid})
    return serialize_id(await _enrich(req))


@router.put("/{request_id}/complete", response_model=RequestOut)
async def complete_request(request_id: str, current_user: dict = Depends(get_current_student)):
    req = await _get_owned_request(request_id, current_user)
    if req["status"] not in ("accepted", "pickup_scheduled"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Request is not ready to be completed")

    oid = req["_id"]
    now = datetime.now(timezone.utc)
    await requests_collection.update_one({"_id": oid}, {"$set": {"status": "completed", "updated_at": now}})
    await items_collection.update_one(
        {"_id": to_object_id(req["item_id"])}, {"$set": {"availability_status": "completed", "updated_at": now}}
    )
    req = await requests_collection.find_one({"_id": oid})
    return serialize_id(await _enrich(req))


@router.put("/{request_id}/reuse", response_model=RequestOut)
async def mark_reused(request_id: str, current_user: dict = Depends(get_current_student)):
    req = await _get_owned_request(request_id, current_user)
    if req["status"] != "completed":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only completed requests can be marked reused")

    now = datetime.now(timezone.utc)
    await items_collection.update_one(
        {"_id": to_object_id(req["item_id"])}, {"$set": {"availability_status": "reused", "updated_at": now}}
    )
    await requests_collection.update_one({"_id": req["_id"]}, {"$set": {"updated_at": now}})
    req = await requests_collection.find_one({"_id": req["_id"]})
    return serialize_id(await _enrich(req))


@router.put("/{request_id}/cancel", response_model=RequestOut)
async def cancel_request(request_id: str, current_user: dict = Depends(get_current_student)):
    oid = to_object_id(request_id)
    req = await requests_collection.find_one({"_id": oid})
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    if req["requester_id"] != current_user["id"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the requester can cancel this request")
    if req["status"] not in ("pending", "accepted", "pickup_scheduled"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This request can no longer be cancelled")

    now = datetime.now(timezone.utc)
    await requests_collection.update_one({"_id": oid}, {"$set": {"status": "cancelled", "updated_at": now}})
    if req["status"] in ("accepted", "pickup_scheduled"):
        await items_collection.update_one(
            {"_id": to_object_id(req["item_id"])}, {"$set": {"availability_status": "available", "updated_at": now}}
        )
    req = await requests_collection.find_one({"_id": oid})
    return serialize_id(await _enrich(req))
