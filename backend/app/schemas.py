from typing import Literal, List, Optional
from pydantic import BaseModel, Field

Verdict = Literal["ALLOWED", "PROHIBITED", "UNCLEAR"]

class CheckResponse(BaseModel):
    verdict: Verdict
    confidence: float = Field(ge=0, le=1)
    reasons: List[str] = []
    matched_rules: Optional[List[str]] = None
    raw: Optional[dict] = None  # brief product snapshot


class AnalyzeURLRequest(BaseModel):
    url: str


class AnalyzeURLResponse(BaseModel):
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    ai_summary: Optional[str] = None
