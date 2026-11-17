from app.database import db
from app.patterns.upload_provider import CloudUploadProvider, LocalUploadProvider, UploadProvider

app_settings_collection = db["app_settings"]


class UploadProviderFactory:
    """Simple Factory. Decides which UploadProvider instance to create and
    return, based on the persisted upload_mode setting, so the rest of the
    application never has to know which concrete class is being used."""

    @staticmethod
    async def get_provider() -> UploadProvider:
        try:
            setting = await app_settings_collection.find_one({"_id": "upload"})
            if setting and setting.get("mode") == "cloud":
                return CloudUploadProvider()
        except Exception:
            pass
        return LocalUploadProvider()
