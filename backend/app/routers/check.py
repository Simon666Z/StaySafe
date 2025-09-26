
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_db
from ..models import Product, CheckLog
from ..schemas import CheckResponse
from ..classifier import classify

router = APIRouter()

FETCH_TTL_HOURS = 12

async def fetch_metadata(platform: str, product_id: str):
    """
    MVP: no external fetch. Treat product_id as pasted text if platform='other'.
    For real Temu/Shein pages, you can implement product_sources later.
    """
    if platform == "other":
        # allow user to paste title/desc into productId for quick tests
        return {"title": product_id, "description": None, "attrs": {}}
    # Placeholder: use product_id as title until scrapers are added
    return {"title": f"{platform}:{product_id}", "description": None, "attrs": {}}

@router.get("/check", response_model=CheckResponse)
async def check(platform: str, productId: str, db: AsyncSession = Depends(get_db)):
    # 1) cache lookup
    q = select(Product).where(Product.platform == platform, Product.product_id == productId)
    res = await db.execute(q)
    prod = res.scalar_one_or_none()

    need_fetch = True
    if prod and prod.last_fetched_ts:
        if prod.last_fetched_ts > datetime.now(timezone.utc) - timedelta(hours=FETCH_TTL_HOURS):
            need_fetch = False

    # 2) refresh if needed
    if not prod or need_fetch:
        meta = await fetch_metadata(platform, productId)
        if not prod:
            prod = Product(
                platform=platform,
                product_id=productId,
                title=meta.get("title"),
                description=meta.get("description"),
                attrs=meta.get("attrs"),
                last_fetched_ts=datetime.now(timezone.utc),
            )
            db.add(prod)
        else:
            prod.title = meta.get("title")
            prod.description = meta.get("description")
            prod.attrs = meta.get("attrs")
            prod.last_fetched_ts = datetime.now(timezone.utc)
        await db.commit()
        await db.refresh(prod)

    # 3) classify
    verdict, conf, reasons, matched = classify(prod.title, prod.description, prod.attrs or {})

    # 4) log
    db.add(CheckLog(
        platform=platform,
        product_id=productId,
        verdict=verdict,
        confidence=conf,
        reasons=reasons,
        matched_rules=matched,
        raw_snapshot={"title": prod.title, "description": prod.description, "attrs": prod.attrs},
    ))
    await db.commit()

    # 5) respond
    return CheckResponse(
        verdict=verdict,
        confidence=conf,
        reasons=reasons,
        matched_rules=matched,
        raw={"title": prod.title, "description": prod.description},
    )
