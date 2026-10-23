import certifi
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

_uses_tls = settings.mongodb_uri.startswith("mongodb+srv://") or "mongodb.net" in settings.mongodb_uri

client = AsyncIOMotorClient(
    settings.mongodb_uri,
    **({"tlsCAFile": certifi.where()} if _uses_tls else {}),
)
db = client[settings.database_name]

users_collection = db["users"]
items_collection = db["items"]
categories_collection = db["categories"]
requests_collection = db["requests"]
reports_collection = db["reports"]


async def init_indexes():
    await users_collection.create_index("email", unique=True)
    await users_collection.create_index("student_id", unique=True, sparse=True)
    await items_collection.create_index([("name", "text"), ("description", "text")])
    await items_collection.create_index("category_id")
    await items_collection.create_index("owner_id")
