# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
ARG BASE=node:${NODE_VERSION}-alpine

# ---------- deps: cài deps để build ----------
FROM ${BASE} AS deps
WORKDIR /app

# Cần toolchain + glibc-compat để build native addon trên Alpine
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json package-lock.json* ./

# QUAN TRỌNG: KHÔNG dùng --ignore-scripts ở prod (để postinstall chạy),
# rồi rebuild bcrypt từ source để chắc chắn có binary đúng kiến trúc
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi \
 && npm rebuild bcrypt --build-from-source \
 && npm cache clean --force

# ---------- build: compile TS -> dist ----------
FROM ${BASE} AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY src ./src
# Bật source map cho debug production (tuỳ chọn)
ENV NODE_OPTIONS=--enable-source-maps
RUN npx tsc --project tsconfig.json
RUN if [ -d src/docs ]; then mkdir -p dist/docs && cp -r src/docs/. dist/docs/; fi

# ---------- prod-deps: chỉ deps runtime ----------
FROM ${BASE} AS prod-deps
WORKDIR /app

# Cần toolchain + glibc-compat để build native addon trên Alpine
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json package-lock.json* ./

# QUAN TRỌNG: KHÔNG dùng --ignore-scripts ở prod (để postinstall chạy),
# rồi rebuild bcrypt từ source để chắc chắn có binary đúng kiến trúc
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi \
 && npm rebuild bcrypt --build-from-source \
 && npm cache clean --force

# ---------- runner: tối giản runtime ----------
FROM ${BASE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Asia/Ho_Chi_Minh
ENV PORT=5001
# Tuỳ chọn: giúp stacktrace dễ đọc khi lỗi prod
ENV NODE_OPTIONS=--enable-source-maps

RUN apk add --no-cache tzdata

# Copy với quyền đúng ngay từ đầu (nhanh & ít layer hơn chown cả thư mục)
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build     --chown=node:node /app/dist         ./dist
COPY --chown=node:node package.json ./

# KHÔNG copy .env vào image. Truyền qua -e hoặc --env-file khi run.
# Nếu cần thư mục logs
RUN mkdir -p /app/logs && chown -R node:node /app

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/ || exit 1

USER node

EXPOSE 5001

CMD ["npm", "start"]