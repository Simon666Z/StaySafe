# Multi-stage Dockerfile: build Next frontend then create Python backend image

# --- Stage 1: Build Next.js frontend ---
FROM node:20-alpine AS frontend-builder
WORKDIR /workspace/frontend

# Copy only package metadata first for better layer caching
COPY ./staysafe/package.json ./staysafe/package-lock.json ./
COPY ./staysafe/next.config.ts ./
COPY ./staysafe/tsconfig.json ./
COPY ./staysafe/public ./public
COPY ./staysafe/src ./src

RUN npm ci
RUN npm run build

# With output: "export" in next.config.ts, the build creates the out directory
# Copy the entire out directory
RUN cp -r out /workspace/out


# --- Stage 2: Python backend runtime image ---
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
  PYTHONUNBUFFERED=1

WORKDIR /app

# System deps needed to build some Python packages (greenlet, asyncpg, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential gcc libpq-dev libffi-dev libssl-dev curl pkg-config && \
  rm -rf /var/lib/apt/lists/*

# Upgrade packaging tools before installing requirements
COPY ./backend/requirements.txt ./
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source (only the backend dir so the python package `app` ends up at /app/app)
COPY ./backend /app

# Copy frontend export into backend static folder if it exists
COPY --from=frontend-builder /workspace/out /app/static

EXPOSE 8000

# Default command: serve FastAPI app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
