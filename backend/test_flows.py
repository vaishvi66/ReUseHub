import asyncio
import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from httpx import ASGITransport, AsyncClient
from app.main import app

async def run_tests():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        print("--- 1. Testing Health Endpoint ---")
        res = await client.get("/api/health")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
        print("[PASS] Health check OK:", res.json())

