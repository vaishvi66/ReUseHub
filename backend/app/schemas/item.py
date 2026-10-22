from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field, model_validator

ListingType = Literal["sell", "giveaway", "exchange"]
Condition = Literal["new", "like_new", "good", "fair"]
ApprovalStatus = Literal["pending", "approved", "rejected", "removed"]
AvailabilityStatus = Literal["available", "reserved", "completed", "reused"]


class ItemCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str = Field(min_length=1, max_length=2000)
    category_id: str
    listing_type: ListingType
    price: Optional[float] = Field(default=None, ge=0)
    condition: Condition
    location: str = Field(min_length=1, max_length=150)
    exchange_requirement: Optional[str] = Field(default=None, max_length=500)

    @model_validator(mode="after")
    def validate_listing_fields(self):
        if self.listing_type == "sell":
            if self.price is None or self.price <= 0:
                raise ValueError("Price is required for items listed for sale")
        else:
            self.price = None

        if self.listing_type == "exchange" and not self.exchange_requirement:
            raise ValueError("Exchange requirement is required for exchange listings")
        if self.listing_type != "exchange":
            self.exchange_requirement = None

        return self


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    description: Optional[str] = Field(default=None, min_length=1, max_length=2000)
    category_id: Optional[str] = None
    listing_type: Optional[ListingType] = None
    price: Optional[float] = Field(default=None, ge=0)
    condition: Optional[Condition] = None
    location: Optional[str] = Field(default=None, min_length=1, max_length=150)
    exchange_requirement: Optional[str] = Field(default=None, max_length=500)

