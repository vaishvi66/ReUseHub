from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

Role = Literal["student", "admin"]
VerificationStatus = Literal["pending", "approved", "rejected"]


class StudentRegister(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    student_id: str = Field(min_length=1, max_length=50)
    college: str = Field(min_length=1, max_length=150)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    confirm_password: str

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower() if isinstance(v, str) else v

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v, info):
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Passwords do not match")
        return v


