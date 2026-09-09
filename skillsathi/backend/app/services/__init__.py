# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, schemes, ai
from .db import engine, Base
from .config import settings

app = FastAPI(title="SkillSathi API", version="0.1.0")

# Create tables (for dev/demo)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "debug": settings.DEBUG}

app.include_router(auth.router)
app.include_router(schemes.router)
app.include_router(ai.router)
