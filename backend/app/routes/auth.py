from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.database import users_collection
from app.middleware.auth import get_current_user
from app.schemas.user import LoginRequest, StudentRegister, TokenResponse, UserOut
from app.utils.objectid import serialize_id
from app.utils.security import (
    DUMMY_PASSWORD_HASH,
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: StudentRegister):
    normalized_email = payload.email.lower().strip()
    student_id = payload.student_id.strip()

    existing_email = await users_collection.find_one({"email": normalized_email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    existing_student_id = await users_collection.find_one({"student_id": student_id})
    if existing_student_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Student ID is already registered",
        )

    now = datetime.now(timezone.utc)
    user_doc = {
        "full_name": payload.full_name.strip(),
        "student_id": student_id,
        "college": payload.college.strip(),
        "email": normalized_email,
        "password_hash": hash_password(payload.password),
        "role": "student",
        "verification_status": "pending",
        "is_active": True,
        "created_at": now,
        "updated_at": now,
        "last_login_at": None,
    }

    try:
        result = await users_collection.insert_one(user_doc)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or Student ID is already registered",
        )

    user_doc["_id"] = result.inserted_id
    return serialize_id(user_doc)


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest):
    normalized_email = payload.email.lower().strip()
    user = await users_collection.find_one({"email": normalized_email})

    # Timing-safe password check: prevents user enumeration via bcrypt duration
    target_hash = user["password_hash"] if user else DUMMY_PASSWORD_HASH
    password_valid = verify_password(payload.password, target_hash)

    if not user or not password_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    # Record login timestamp
    now = datetime.now(timezone.utc)
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login_at": now, "updated_at": now}},
    )
    user["last_login_at"] = now

    token = create_access_token({"sub": str(user["_id"]), "role": user.get("role", "student")})
    return TokenResponse(access_token=token, user=UserOut(**serialize_id(user)))


@router.get("/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return current_user
