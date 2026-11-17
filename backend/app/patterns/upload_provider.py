import uuid
from abc import ABC, abstractmethod
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.config import settings

ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024


class UploadProvider(ABC):
    """Abstract base class (Product) for the Simple Factory below."""

    @abstractmethod
    async def save(self, file: UploadFile) -> str:
        ...


class LocalUploadProvider(UploadProvider):
    """Concrete product. Stores the image on the application server's own
    local disk, under the configured upload directory."""

    async def save(self, file: UploadFile) -> str:
        contents = await _read_and_validate(file)

        upload_dir = Path(settings.upload_dir)
        upload_dir.mkdir(parents=True, exist_ok=True)

        filename = _generate_filename(file)
        with open(upload_dir / filename, "wb") as f:
            f.write(contents)

        return f"/uploads/{filename}"


class CloudUploadProvider(UploadProvider):
    """Concrete product. Stub for an external/cloud image host. Kept
    deterministic and offline (no real cloud credentials in this project),
    while still returning a URL shaped like a cloud-hosted asset so the rest
    of the application never has to know which provider actually ran."""

    async def save(self, file: UploadFile) -> str:
        contents = await _read_and_validate(file)

        upload_dir = Path(settings.upload_dir) / "cloud"
        upload_dir.mkdir(parents=True, exist_ok=True)

        filename = _generate_filename(file)
        with open(upload_dir / filename, "wb") as f:
            f.write(contents)

        return f"/uploads/cloud/{filename}"


async def _read_and_validate(file: UploadFile) -> bytes:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPEG, PNG, or WEBP images are allowed",
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image must be smaller than 5MB",
        )
    return contents


def _generate_filename(file: UploadFile) -> str:
    extension = Path(file.filename or "").suffix or ".jpg"
    return f"{uuid.uuid4().hex}{extension}"
