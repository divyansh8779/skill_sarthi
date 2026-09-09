# backend/app/routers/schemes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import schemas
from .. import crud
from ..db import get_db

router = APIRouter(prefix="/schemes", tags=["schemes"])

@router.get("/", response_model=List[schemas.SchemeOut])
def list_schemes(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.get_schemes(db, skip=skip, limit=limit)

@router.get("/{code}", response_model=schemas.SchemeOut)
def get_scheme(code: str, db: Session = Depends(get_db)):
    s = crud.get_scheme_by_code(db, code)
    if not s:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Scheme not found")
    return s
