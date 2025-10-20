# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

# ---------- deps (cài deps để build) ----------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ tzdata
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --ignore-scripts; else npm install --ignore-scripts; fi

# ---------- build (ts -> dist) ----------
FROM deps AS build
WORKDIR /app
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- prod-deps (chỉ deps runtime) ----------
FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --ignore-scripts; else npm install --omit=dev --ignore-scripts; fi

# ---------- runner ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
RUN apk add --no-cache tzdata

ENV NODE_ENV=production
ENV TZ=Asia/Ho_Chi_Minh
ENV PORT=8000
# Cho phép đổi path health qua env nếu cần
ENV HEALTH_PATH=/healthz

# Chỉ copy những gì cần cho runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Quyền & logs
RUN mkdir -p /app/logs /app/src/logs && chown -R node:node /app
USER node

EXPOSE 8000

# Healthcheck: gọi tới ${PORT}${HEALTH_PATH}
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||8000)+(process.env.HEALTH_PATH||'/healthz'),r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/server.js"]
