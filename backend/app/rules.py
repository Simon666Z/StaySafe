import re
from typing import Sequence, Tuple, List

# tag, pattern (regex), weight, severity, note
DEFAULT_RULES: List[Tuple[str, str, int, int, str]] = [
    ("laser-pointer-class>1", r"\bclass\s*[234]\b|>\s*1\s*mW|>1mW|\b[3-9]\s*mW\b", 3, 5,
     "Swiss law permits only class 1 laser pointers."),
    ("switchblade", r"switch\s*blade|automatic\s*knife|spring\s*knife", 2, 4,
     "Prohibited automatic knives."),
    ("stun-gun", r"\bstun\s*gun\b|\btaser\b", 3, 5,
     "Electroshock weapons restricted."),
    ("fireworks-high", r"\bF3\b|\bF4\b|\bP2\b|professional\s*fireworks", 2, 4,
     "High-category fireworks restricted."),
]

def apply_rules(text: str, rules: Sequence[Tuple[str, str, int, int, str]] = DEFAULT_RULES):
    matched = []
    score = 0
    for tag, pattern, weight, _sev, _note in rules:
        if re.search(pattern, text, flags=re.IGNORECASE):
            matched.append(tag)
            score += weight
    return matched, score
