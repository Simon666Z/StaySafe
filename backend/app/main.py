import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import health
# from .db import engine, Base
# import asyncio

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

app.include_router(health.router, tags=["system"])

# (Optional) quick banner
@app.get("/")
async def root():
    return {"name": "StaySafe API", "docs": "/docs", "health": "/healthz"}

# @app.on_event("startup")
# async def on_startup():
#     # Auto-create tables (hackathon-friendly; replace with Alembic later if desired)
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)