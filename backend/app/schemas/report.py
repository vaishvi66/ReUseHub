from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

ReportStatus = Literal["pending", "under_review", "resolved", "dismissed"]


class ReportCreate(BaseModel):
    reported_user_id: Optional[str] = None
    reported_item_id: Optional[str] = None
    reason: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=1, max_length=1000)


class ReportOut(BaseModel):
    id: str
    reported_by: str
    reported_by_name: Optional[str] = None
    reported_user_id: Optional[str] = None
    reported_item_id: Optional[str] = None
    reported_item_name: Optional[str] = None
    reason: str
    description: str
    status: ReportStatus
    created_at: datetime
    updated_at: datetime
