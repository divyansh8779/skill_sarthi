# backend/app/routers/__init__.py
"""
Router package initializer.

This module imports individual APIRouter instances from submodules
and exposes them for inclusion in the main FastAPI app.

Usage in app.main:
    from .routers import auth_router, schemes_router, ai_router
    app.include_router(auth_router)
    ...
"""

from .auth import router as auth_router
from .schemes import router as schemes_router
from .ai import router as ai_router

__all__ = ["auth_router", "schemes_router", "ai_router"]
