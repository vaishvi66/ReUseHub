import asyncio
from datetime import datetime, timezone

from app.database import categories_collection, items_collection, users_collection
from app.utils.security import hash_password

CATEGORIES = ["Books", "Study Materials", "Electronics", "Furniture", "Other"]

ADMIN = {
    "full_name": "Admin",
    "email": "admin@reusehub.com",
    "password": "Admin@123",
}

STUDENTS = [
    {"full_name": "Asha Rao", "student_id": "STU1001", "college": "City College of Engineering", "email": "asha@college.edu", "password": "Student@123"},
    {"full_name": "Rahul Mehta", "student_id": "STU1002", "college": "City College of Engineering", "email": "rahul@college.edu", "password": "Student@123"},
    {"full_name": "Priya Nair", "student_id": "STU1003", "college": "City College of Engineering", "email": "priya@college.edu", "password": "Student@123"},
    {"full_name": "Ankit Sharma", "student_id": "STU1004", "college": "City College of Engineering", "email": "ankit@college.edu", "password": "Student@123"},
    {"full_name": "Sneha Patel", "student_id": "STU1005", "college": "City College of Engineering", "email": "sneha@college.edu", "password": "Student@123"},
    {"full_name": "Vikram Aditya", "student_id": "STU1006", "college": "City College of Engineering", "email": "vikram@college.edu", "password": "Student@123"},
    {"full_name": "Kavita Deshmukh", "student_id": "STU1007", "college": "City College of Engineering", "email": "kavita@college.edu", "password": "Student@123"},
]

SAMPLE_ITEMS = [
    # --- BOOKS ---
    {
        "name": "Introduction to Algorithms (CLRS 3rd Edition)",
        "description": "Standard MIT Press algorithms textbook by Cormen, Leiserson, Rivest, Stein. Minimal pencil notes in dynamic programming and graph algorithms chapters. Very clean condition.",
        "category": "Books",
        "listing_type": "sell",
        "price": 750,
        "condition": "good",
        "location": "Library Central Hall, 1st Floor",
        "image_url": "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80",
        "owner_index": 0,
    },
    {
        "name": "Concepts of Physics (Vol 1 & 2 by H.C. Verma)",
        "description": "Both volumes 1 and 2 in good condition. Helped me clear first-year engineering physics and mechanics fundamentals. Giving away completely free to any junior.",
        "category": "Books",
        "listing_type": "giveaway",
        "price": None,
        "condition": "good",
        "location": "Hostel Block A, Common Room",
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        "owner_index": 1,
    },
    {
        "name": "Operating System Concepts (Silberschatz Dinosaur Book)",
