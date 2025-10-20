# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
ARG BASE=node:${NODE_VERSION}-alpine

# ---------- deps: cài deps để build ----------
FROM ${BASE} AS deps
WORKDIR /app
# Toolchain chỉ cần ở stage build (native addons)
RUN apk add --no-cache python3 make g++ tzdata
# Giữ cache tốt: copy lockfile trước
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --ignore-scripts; \
    else \
      npm install --ignore-scripts; \
    fi

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
# Không cần toolchain ở runtime deps stage
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev --ignore-scripts; \
    else \
      npm install --omit=dev --ignore-scripts; \
    fi \
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
RUN mkdir -p /app/logs && chown -R node:node /app/logs

USER node

EXPOSE 5001

CMD ["npm", "start"]