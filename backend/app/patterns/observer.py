from abc import ABC, abstractmethod
from datetime import datetime, timezone

from app.database import db

notifications_collection = db["notifications"]


class Observer(ABC):
    """Abstract observer. Defines the prototype for the update operation
    that concrete observers must implement."""

    @abstractmethod
    async def update(self, message: str, recipient_id: str) -> None:
        ...


class NotificationObserver(Observer):
    """Concrete observer. Inserts a notification row into the database for
    the correct user on being notified."""

    async def update(self, message: str, recipient_id: str) -> None:
        await notifications_collection.insert_one(
            {
                "recipient_id": recipient_id,
                "message": message,
                "is_read": False,
                "created_at": datetime.now(timezone.utc),
            }
        )
