from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import String, Text, JSON, Float, Integer, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column

from .db import Base


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    platform: Mapped[str] = mapped_column(String(20), index=True)
    product_id: Mapped[str] = mapped_column(String(100), index=True)
    title: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    attrs: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    last_fetched_ts: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    __table_args__ = (
        Index("uq_platform_product", "platform", "product_id", unique=True),
    )


class CheckLog(Base):
    __tablename__ = "check_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    platform: Mapped[str] = mapped_column(String(20), index=True)
    product_id: Mapped[str] = mapped_column(String(100), index=True)
    verdict: Mapped[str] = mapped_column(String(20))
    confidence: Mapped[float] = mapped_column(Float)
    reasons: Mapped[list] = mapped_column(JSON)             # list[str]
    matched_rules: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    raw_snapshot: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_ts: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class Rule(Base):
    __tablename__ = "rules"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tag: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(256))
    pattern: Mapped[str] = mapped_column(String(512))        # regex / keywords
    weight: Mapped[int] = mapped_column(Integer, default=1)
    severity: Mapped[int] = mapped_column(Integer, default=1)  # 1..5
    note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
