# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only manifests first to leverage caching
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
  else npm install; fi

# Now copy the rest
COPY . .

RUN \
  if [ -f package-lock.json ]; then npm run build; \
  elif [ -f yarn.lock ]; then yarn build; \
  else npm run build; fi

# --- Run stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000

COPY --from=builder /app/package.json /app/package-lock.json* /app/yarn.lock* /app/pnpm-lock.yaml* ./
RUN \
  if [ -f package-lock.json ]; then npm ci --omit=dev; \
  elif [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
  else npm install --omit=dev; fi

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm","start"]
