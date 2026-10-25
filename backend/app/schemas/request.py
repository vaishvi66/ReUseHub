from datetime import date, datetime, time
from typing import Literal, Optional

from pydantic import BaseModel, Field

RequestStatus = Literal["pending", "accepted", "rejected", "pickup_scheduled", "completed", "cancelled"]


class PickupSchedule(BaseModel):
    pickup_location: str = Field(min_length=1, max_length=200)
    pickup_date: date
    pickup_time: time


class RequestOut(BaseModel):
    id: str
    item_id: str
    item_name: Optional[str] = None
    requester_id: str
    requester_name: Optional[str] = None
    owner_id: str
    owner_name: Optional[str] = None
    status: RequestStatus
    note: Optional[str] = None
    pickup_location: Optional[str] = None
    pickup_date: Optional[str] = None
    pickup_time: Optional[str] = None
    created_at: datetime
    updated_at: datetime
