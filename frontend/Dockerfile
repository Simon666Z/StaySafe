#--- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# At build time you can pass NEXT_PUBLIC_API_BASE_URL with --build-arg if needed
RUN npm run build

#--- Run stage ---
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
ENV PORT=3000
EXPOSE 3000
CMD ["npm","start"]