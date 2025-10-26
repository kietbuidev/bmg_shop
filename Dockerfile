# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

# ---------- Base deps ----------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ tzdata
COPY package.json package-lock.json* ./

RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# ---------- Build ----------
FROM deps AS build
WORKDIR /app
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Runtime deps ----------
FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi

# ---------- Runner ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Cài tzdata để set timezone
RUN apk add --no-cache tzdata

# Cấu hình biến mặc định
ENV NODE_ENV=production
ENV PORT=5001

# Copy node_modules và dist
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Tạo thư mục logs
RUN mkdir -p /app/logs && chown -R node:node /app

USER node
EXPOSE 5001

# HEALTHCHECK ping /health của server
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "dist/server.js"]