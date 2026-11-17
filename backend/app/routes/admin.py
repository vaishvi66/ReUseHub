from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.database import items_collection, reports_collection, requests_collection, users_collection
from app.middleware.auth import get_current_admin
from app.schemas.admin import UpdateReportStatusPayload, UpdateRequestStatusPayload, VerifyStudentPayload
from app.schemas.item import ItemOut
from app.schemas.report import ReportOut
from app.schemas.request import RequestOut
from app.schemas.user import UserOut
from app.utils.objectid import serialize_id, to_object_id
from app.routes.items import _attach_owner_name
from app.routes.reports import _enrich as enrich_report
from app.routes.requests import _enrich as enrich_request

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/students", response_model=list[UserOut])
async def list_students(verification_status: Optional[str] = None, admin: dict = Depends(get_current_admin)):
    query: dict = {"role": "student"}
    if verification_status:
        query["verification_status"] = verification_status
    students = await users_collection.find(query).sort("created_at", -1).to_list(length=500)
    return [serialize_id(s) for s in students]


@router.put("/students/{student_id}/verify", response_model=UserOut)
async def verify_student(student_id: str, payload: VerifyStudentPayload, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(student_id)
    student = await users_collection.find_one({"_id": oid, "role": "student"})
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    new_status = "approved" if payload.action == "approve" else "rejected"
    await users_collection.update_one(
        {"_id": oid}, {"$set": {"verification_status": new_status, "updated_at": datetime.now(timezone.utc)}}
    )
    student = await users_collection.find_one({"_id": oid})
    return serialize_id(student)


@router.put("/students/{student_id}/activate", response_model=UserOut)
async def activate_student(student_id: str, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(student_id)
    await users_collection.update_one(
        {"_id": oid, "role": "student"}, {"$set": {"is_active": True, "updated_at": datetime.now(timezone.utc)}}
    )
    student = await users_collection.find_one({"_id": oid})
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return serialize_id(student)


@router.put("/students/{student_id}/deactivate", response_model=UserOut)
async def deactivate_student(student_id: str, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(student_id)
    await users_collection.update_one(
        {"_id": oid, "role": "student"}, {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc)}}
    )
    student = await users_collection.find_one({"_id": oid})
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")
    return serialize_id(student)


@router.get("/items", response_model=list[ItemOut])
async def list_all_items(approval_status: Optional[str] = None, admin: dict = Depends(get_current_admin)):
    query: dict = {}
    if approval_status:
        query["approval_status"] = approval_status
    items = await items_collection.find(query).sort("created_at", -1).to_list(length=500)
    return [await _attach_owner_name(serialize_id(i)) for i in items]


@router.put("/items/{item_id}/approve", response_model=ItemOut)
async def approve_item(item_id: str, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(item_id)
    await items_collection.update_one(
        {"_id": oid}, {"$set": {"approval_status": "approved", "updated_at": datetime.now(timezone.utc)}}
    )
    item = await items_collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return await _attach_owner_name(serialize_id(item))


@router.put("/items/{item_id}/reject", response_model=ItemOut)
async def reject_item(item_id: str, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(item_id)
    await items_collection.update_one(
        {"_id": oid}, {"$set": {"approval_status": "rejected", "updated_at": datetime.now(timezone.utc)}}
    )
    item = await items_collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return await _attach_owner_name(serialize_id(item))


@router.put("/items/{item_id}/remove", response_model=ItemOut)
async def remove_item(item_id: str, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(item_id)
    await items_collection.update_one(
        {"_id": oid}, {"$set": {"approval_status": "removed", "updated_at": datetime.now(timezone.utc)}}
    )
    item = await items_collection.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return await _attach_owner_name(serialize_id(item))


@router.get("/requests", response_model=list[RequestOut])
async def list_all_requests(status_filter: Optional[str] = Query(None, alias="status"), admin: dict = Depends(get_current_admin)):
    query: dict = {}
    if status_filter:
        query["status"] = status_filter
    reqs = await requests_collection.find(query).sort("created_at", -1).to_list(length=500)
    return [serialize_id(await enrich_request(r)) for r in reqs]


@router.put("/requests/{request_id}/status", response_model=RequestOut)
async def update_request_status(request_id: str, payload: UpdateRequestStatusPayload, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(request_id)
    await requests_collection.update_one(
        {"_id": oid}, {"$set": {"status": payload.status, "updated_at": datetime.now(timezone.utc)}}
    )
    req = await requests_collection.find_one({"_id": oid})
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    return serialize_id(await enrich_request(req))


@router.get("/reports", response_model=list[ReportOut])
async def list_all_reports(status_filter: Optional[str] = Query(None, alias="status"), admin: dict = Depends(get_current_admin)):
    query: dict = {}
    if status_filter:
        query["status"] = status_filter
    reports = await reports_collection.find(query).sort("created_at", -1).to_list(length=500)
    return [serialize_id(await enrich_report(r)) for r in reports]


@router.put("/reports/{report_id}", response_model=ReportOut)
async def update_report_status(report_id: str, payload: UpdateReportStatusPayload, admin: dict = Depends(get_current_admin)):
    oid = to_object_id(report_id)
    await reports_collection.update_one(
        {"_id": oid}, {"$set": {"status": payload.status, "updated_at": datetime.now(timezone.utc)}}
    )
    report = await reports_collection.find_one({"_id": oid})
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return serialize_id(await enrich_report(report))


@router.get("/dashboard")
async def admin_dashboard(admin: dict = Depends(get_current_admin)):
    total_students = await users_collection.count_documents({"role": "student"})
    pending_verifications = await users_collection.count_documents({"role": "student", "verification_status": "pending"})
    total_listings = await items_collection.count_documents({})
    pending_approvals = await items_collection.count_documents({"approval_status": "pending"})
    active_requests = await requests_collection.count_documents({"status": {"$in": ["pending", "accepted", "pickup_scheduled"]}})
    completed_reuses = await items_collection.count_documents({"availability_status": "reused"})
    pending_reports = await reports_collection.count_documents({"status": "pending"})

    categories_breakdown = await items_collection.aggregate(
        [{"$group": {"_id": "$category_id", "count": {"$sum": 1}}}]
    ).to_list(length=50)
    listing_types_breakdown = await items_collection.aggregate(
        [{"$group": {"_id": "$listing_type", "count": {"$sum": 1}}}]
    ).to_list(length=10)

    return {
        "total_students": total_students,
        "pending_verifications": pending_verifications,
        "total_listings": total_listings,
        "pending_approvals": pending_approvals,
        "active_requests": active_requests,
        "completed_reuses": completed_reuses,
        "pending_reports": pending_reports,
        "items_by_category": [{"category_id": c["_id"], "count": c["count"]} for c in categories_breakdown],
        "items_by_listing_type": [{"listing_type": c["_id"], "count": c["count"]} for c in listing_types_breakdown],
    }
