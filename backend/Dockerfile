# --- Build runtime image for FastAPI ---
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# System deps (psycopg/asyncpg build needs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY pyproject.toml* poetry.lock* requirements.txt* /app/
# Support either pyproject+poetry or requirements.txt:
RUN if [ -f "requirements.txt" ]; then \
      pip install --no-cache-dir -r requirements.txt; \
    else \
      pip install --no-cache-dir uvicorn[standard] fastapi pydantic pydantic-settings \
        SQLAlchemy asyncpg alembic httpx beautifulsoup4 python-dotenv; \
    fi

# Copy app code
COPY . /app

EXPOSE 8000

# Start FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
