from datetime import datetime

from pydantic import BaseModel, Field


class CategoryCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)


class CategoryUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=50)


class CategoryOut(BaseModel):
    id: str
    name: str
    created_at: datetime

