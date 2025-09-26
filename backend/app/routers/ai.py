from fastapi import APIRouter, HTTPException
import os
import openai

from ..schemas import AnalyzeURLRequest, AnalyzeURLResponse
from ..utils import fetch_url_title_description

router = APIRouter()


@router.post("/analyze-url", response_model=AnalyzeURLResponse)
async def analyze_url(req: AnalyzeURLRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="OPENAI_API_KEY not set in environment")
    openai.api_key = api_key

    title, description = await fetch_url_title_description(req.url)

    # Build a simple prompt
    content = f"URL: {req.url}\nTitle: {title or ''}\nDescription: {description or ''}\n\nPlease provide a concise summary and highlight potential policy issues (if any)."

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": content}],
            max_tokens=300,
            temperature=0.0,
        )
        summary = resp.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI request failed: {e}")

    return AnalyzeURLResponse(url=req.url, title=title, description=description, ai_summary=summary)
