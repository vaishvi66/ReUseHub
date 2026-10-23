from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status


def to_object_id(id_str: str) -> ObjectId:
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid id")


def serialize_id(doc: dict) -> dict:
    if doc is None:
        return doc
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc

