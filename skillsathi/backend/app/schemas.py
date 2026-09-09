# backend/app/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: Optional[int] = None
    exp: Optional[int] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    language: Optional[str] = "en"

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str]
    language: str

    class Config:
        orm_mode = True

class SchemeOut(BaseModel):
    id: int
    code: str
    title: str
    description: Optional[str]
    eligibility: Optional[str]
    source_url: Optional[str]

    class Config:
        orm_mode = True

class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"
    context: Optional[str] = None
