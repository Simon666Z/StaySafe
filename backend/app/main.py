# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# IMPORTANT: import models so Base knows about tables before create_all
from . import models                   # noqa: F401
from .db import engine, Base, init_db  # noqa: F401
from .routers import health
from .routers import ai
# If you already created check.py router, keep this import; else comment it.
try:
    from .routers import check         # noqa: F401
    HAS_CHECK = True
except Exception:
    HAS_CHECK = False

app = FastAPI(title="StaySafe API", version="0.1.0")

origins_env = os.getenv("ALLOWED_ORIGINS", "*")
origins = [o.strip() for o in origins_env.split(",")] if origins_env else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    # Initialize DB schema using the DB module's init function.
    # Keep a single place responsible for creating tables to avoid duplication
    # and circular import issues.
    try:
        await init_db()
    except Exception as e:
        import logging
        logging.getLogger("uvicorn.error").exception("DB init failed: %s", e)
        # In development we log and continue; consider re-raising in production.

# Routes
app.include_router(health.router, tags=["system"])
app.include_router(ai.router, tags=["ai"])
if HAS_CHECK:
    app.include_router(check.router, tags=["check"])

@app.get("/")
async def root():
    return {"name": "StaySafe API", "docs": "/docs", "health": "/healthz"}
