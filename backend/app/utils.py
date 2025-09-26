from typing import Optional, Tuple
import httpx
from bs4 import BeautifulSoup

async def fetch_url_title_description(url: str) -> Tuple[Optional[str], Optional[str]]:
	"""Fetch a URL and return (title, description) if available."""
	try:
		async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
			resp = await client.get(url)
			resp.raise_for_status()
			html = resp.text
	except Exception:
		return None, None

	try:
		soup = BeautifulSoup(html, "html.parser")
		title_tag = soup.find("title")
		title = title_tag.get_text(strip=True) if title_tag else None
		desc_tag = soup.find("meta", attrs={"name": "description"})
		if not desc_tag:
			desc_tag = soup.find("meta", attrs={"property": "og:description"})
		description = desc_tag.get("content") if desc_tag else None
		return title, description
	except Exception:
		return None, None
