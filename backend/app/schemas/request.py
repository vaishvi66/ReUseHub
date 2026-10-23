from datetime import date, datetime, time
from typing import Literal, Optional

from pydantic import BaseModel, Field

RequestStatus = Literal["pending", "accepted", "rejected", "pickup_scheduled", "completed", "cancelled"]


class PickupSchedule(BaseModel):
    pickup_location: str = Field(min_length=1, max_length=200)
    pickup_date: date
    pickup_time: time

