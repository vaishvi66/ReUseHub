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

        print("\n--- 2. Testing Public Categories ---")
        res = await client.get("/api/categories")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        categories = res.json()
        print(f"[PASS] Found {len(categories)} categories: {[c['name'] for c in categories]}")
        assert len(categories) > 0, "No categories returned"

        print("\n--- 3. Testing Public Browse Items ---")
        res = await client.get("/api/items")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        items = res.json()
        print(f"[PASS] Found {len(items)} approved items publicly available")

        print("\n--- 4. Testing Sustainability Dashboard ---")
        res = await client.get("/api/dashboard/sustainability")
        assert res.status_code == 200, f"Expected 200, got {res.status_code}"
        sustainability = res.json()
        print(f"[PASS] Sustainability metrics: {sustainability}")

        print("\n--- 5. Testing Admin Login ---")
        res = await client.post("/api/auth/login", json={"email": "admin@reusehub.com", "password": "Admin@123"})
        assert res.status_code == 200, f"Admin login failed: {res.text}"
        admin_data = res.json()
        admin_token = admin_data["access_token"]
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        print(f"[PASS] Admin logged in: {admin_data['user']['full_name']} ({admin_data['user']['role']})")

        print("\n--- 6. Testing Admin Dashboard ---")
        res = await client.get("/api/admin/dashboard", headers=admin_headers)
        assert res.status_code == 200, f"Admin dashboard failed: {res.text}"
        print(f"[PASS] Admin dashboard stats: {res.json()}")

        print("\n--- 7. Testing Admin Students List ---")
        res = await client.get("/api/admin/students", headers=admin_headers)
        assert res.status_code == 200, f"Admin students failed: {res.text}"
        students = res.json()
        print(f"[PASS] Admin retrieved {len(students)} students")

        print("\n--- 8. Testing Student Login (Asha) ---")
        res = await client.post("/api/auth/login", json={"email": "asha@college.edu", "password": "Student@123"})
        assert res.status_code == 200, f"Student login failed: {res.text}"
        student_data = res.json()
        student_token = student_data["access_token"]
        student_headers = {"Authorization": f"Bearer {student_token}"}
        print(f"[PASS] Student logged in: {student_data['user']['full_name']} (verification: {student_data['user']['verification_status']})")

        print("\n--- 9. Testing Student Dashboard ---")
        res = await client.get("/api/dashboard/student", headers=student_headers)
        assert res.status_code == 200, f"Student dashboard failed: {res.text}"
        print(f"[PASS] Student dashboard stats: {res.json()}")

        print("\n--- 10. Testing Student My Items ---")
        res = await client.get("/api/items/mine", headers=student_headers)
        assert res.status_code == 200, f"My items failed: {res.text}"
        my_items = res.json()
        print(f"[PASS] Student has {len(my_items)} listings")
