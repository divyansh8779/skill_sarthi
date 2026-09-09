# backend/app/services/auth_service.py
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional
from ..config import settings

def create_access_token(subject: str | int, expires_delta: Optional[timedelta] = None):
    to_encode = {"sub": str(subject)}
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return encoded
