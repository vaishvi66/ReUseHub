from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import init_indexes
from app.routes import health, items, requests

app = FastAPI(title="ReUseHub API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

app.include_router(health.router, prefix="/api")
app.include_router(items.router, prefix="/api")
app.include_router(requests.router, prefix="/api")


@app.on_event("startup")
async def on_startup():
    try:
        await init_indexes()
    except Exception as exc:
        print(
            f"Warning: could not connect to MongoDB at startup ({exc}). "
            "Ensure MongoDB is running and MONGODB_URI is correctly set."
        )


@app.get("/")
async def root():
    return {"message": "ReUseHub API is running"}
