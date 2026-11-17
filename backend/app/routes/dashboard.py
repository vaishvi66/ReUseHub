from fastapi import APIRouter, Depends

from app.database import categories_collection, items_collection, requests_collection, users_collection
from app.middleware.auth import get_current_student

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/sustainability")
async def sustainability_stats():
    total_items_listed = await items_collection.count_documents({"approval_status": "approved"})
    total_items_reused = await items_collection.count_documents({"availability_status": "reused"})
    active_students = await users_collection.count_documents({"role": "student", "is_active": True, "verification_status": "approved"})

    owner_ids = await items_collection.distinct("owner_id", {"approval_status": "approved"})
    requester_ids = await requests_collection.distinct("requester_id")
    students_participated = len(set(owner_ids) | set(requester_ids))

    # Real category-level aggregations
    all_categories = await categories_collection.find().to_list(50)
    category_name_by_id = {str(c["_id"]): c["name"].lower() for c in all_categories}

    items_by_category_raw = await items_collection.aggregate(
        [
            {"$match": {"approval_status": "approved"}},
            {"$group": {"_id": "$category_id", "count": {"$sum": 1}}},
        ]
    ).to_list(length=50)

    books_count = 0
    electronics_count = 0
    furniture_count = 0
    study_materials_count = 0
    other_count = 0

    for item in items_by_category_raw:
        cat_id = str(item["_id"])
        cat_name = category_name_by_id.get(cat_id, "")
        count = item["count"]
        if "book" in cat_name:
            books_count += count
        elif "electronic" in cat_name:
            electronics_count += count
        elif "furniture" in cat_name:
            furniture_count += count
        elif "study" in cat_name or "material" in cat_name:
            study_materials_count += count
        else:
            other_count += count

    # Real carbon calculations:
    # Textbooks: ~2.4 kg CO2 each
    # Study materials: ~1.5 kg CO2 each
    # Electronics: ~8.5 kg CO2 each
    # Furniture: ~15.0 kg CO2 each
    # Other: ~3.0 kg CO2 each
    co2_diverted_kg = round(
        (books_count * 2.4)
        + (study_materials_count * 1.5)
        + (electronics_count * 8.5)
        + (furniture_count * 15.0)
        + (other_count * 3.0),
        1,
    )

    # Real rupee savings: sum of prices of all approved active listings
    approved_items = await items_collection.find({"approval_status": "approved"}).to_list(length=200)
    total_student_savings = sum(item.get("price") or 0 for item in approved_items)

    reused_by_category = await items_collection.aggregate(
        [
            {"$match": {"availability_status": "reused"}},
            {"$group": {"_id": "$category_id", "count": {"$sum": 1}}},
        ]
    ).to_list(length=50)

    items_by_listing_type = await items_collection.aggregate(
        [
            {"$match": {"approval_status": "approved"}},
            {"$group": {"_id": "$listing_type", "count": {"$sum": 1}}},
        ]
    ).to_list(length=10)

    return {
        "total_items_listed": total_items_listed,
        "total_items_reused": total_items_reused,
        "active_students": active_students,
        "students_participated": students_participated,
        "co2_diverted_kg": co2_diverted_kg,
        "electronics_count": electronics_count,
        "books_count": books_count + study_materials_count,
        "total_student_savings": total_student_savings,
        "reused_by_category": [{"category_id": c["_id"], "count": c["count"]} for c in reused_by_category],
        "items_by_listing_type": [{"listing_type": c["_id"], "count": c["count"]} for c in items_by_listing_type],
    }


@router.get("/student")
async def student_dashboard(current_user: dict = Depends(get_current_student)):
    owner_id = current_user["id"]

    my_listings = await items_collection.count_documents({"owner_id": owner_id})
    pending_requests = await requests_collection.count_documents({"owner_id": owner_id, "status": "pending"})
    my_active_requests = await requests_collection.count_documents(
        {"requester_id": owner_id, "status": {"$in": ["pending", "accepted", "pickup_scheduled"]}}
    )
    completed_transactions = await requests_collection.count_documents(
        {"$or": [{"owner_id": owner_id}, {"requester_id": owner_id}], "status": "completed"}
    )
    items_reused = await items_collection.count_documents({"owner_id": owner_id, "availability_status": "reused"})

    return {
        "my_listings": my_listings,
        "pending_requests": pending_requests,
        "my_active_requests": my_active_requests,
        "completed_transactions": completed_transactions,
        "items_reused": items_reused,
    }
