from typing import Optional, Dict, Any, Tuple, List
from .rules import apply_rules

def classify(title: Optional[str], description: Optional[str], attrs: Optional[Dict[str, Any]]
            ) -> Tuple[str, float, List[str], List[str]]:
    text = " ".join([x for x in [title or "", description or ""] if x])[:8000]
    matched, score = apply_rules(text)

    if score >= 4:
        verdict, conf = "PROHIBITED", min(0.7 + 0.1 * score, 0.99)
    elif score == 0 and text.strip():
        verdict, conf = "ALLOWED", 0.6
    else:
        verdict, conf = "UNCLEAR", 0.5

    reasons: List[str] = []
    if matched:
        reasons.append("Matched prohibited patterns: " + ", ".join(matched))
    if verdict == "UNCLEAR":
        reasons.append("Insufficient evidence; manual review recommended.")

    return verdict, conf, reasons, matched
