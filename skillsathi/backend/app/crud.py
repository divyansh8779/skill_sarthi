# backend/app/crud.py
from sqlalchemy.orm import Session
from . import schemas
from passlib.context import CryptContext

from . import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user_in: schemas.UserCreate):
    hashed = pwd_context.hash(user_in.password)
    user = models.User(email=user_in.email, hashed_password=hashed, full_name=user_in.full_name, language=user_in.language)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_schemes(db: Session, skip: int = 0, limit: int = 50):
    return db.query(models.Scheme).offset(skip).limit(limit).all()

def get_scheme_by_code(db: Session, code: str):
    return db.query(models.Scheme).filter(models.Scheme.code == code).first()
