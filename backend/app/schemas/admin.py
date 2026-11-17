from typing import Literal

from pydantic import BaseModel

VerifyAction = Literal["approve", "reject"]
RequestStatusUpdate = Literal["pending", "accepted", "rejected", "pickup_scheduled", "completed", "cancelled"]
ReportStatusUpdate = Literal["pending", "under_review", "resolved", "dismissed"]


class VerifyStudentPayload(BaseModel):
    action: VerifyAction


class UpdateRequestStatusPayload(BaseModel):
    status: RequestStatusUpdate


class UpdateReportStatusPayload(BaseModel):
    status: ReportStatusUpdate
