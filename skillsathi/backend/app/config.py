# backend/app/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@db:5432/skillsathi"
    JWT_SECRET: str = "change-me-in-prod"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    HF_API_TOKEN: str | None = None
    HF_MODEL: str = "google/flan-t5-small"
    COQUI_TTS_URL: str | None = None
    ENABLE_LOCAL_STT: bool = False
    DEBUG: bool = True

    class Config:
        env_file = ".env"

settings = Settings()
