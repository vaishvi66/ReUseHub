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
