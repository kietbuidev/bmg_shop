# syntax=docker/dockerfile:1
ARG NODE_VERSION=20
ARG BASE=node:${NODE_VERSION}-alpine

# ---------- STAGE 1: PROD DEPS ----------
# Stage này CHỈ cài 'dependencies' (bỏ qua dev)
# Nhưng vẫn cần tools để build bcrypt
FROM ${BASE} AS prod-deps
WORKDIR /app

# Cần toolchain để build native addon (bcrypt)
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json package-lock.json* ./

# CHỈ CÀI DEPENDENCIES (production)
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi \
 && npm rebuild bcrypt --build-from-source \
 && npm cache clean --force

# ---------- STAGE 2: RUNNER (Production) ----------
# Stage này siêu mỏng nhẹ, không chứa tools build
FROM ${BASE} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Asia/Ho_Chi_Minh
ENV PORT=5001
# ENV NODE_OPTIONS=--enable-source-maps # Bật nếu bạn có file .map

# Chỉ cài đặt runtime dependencies của OS
RUN apk add --no-cache tzdata

# Copy node_modules (chỉ prod) từ stage 1
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules

# QUAN TRỌNG: Copy code đã compile (thư mục dist) từ máy của bạn
# Bạn phải chạy 'npm run build' ở máy local TRƯỚC KHI build image
COPY --chown=node:node ./dist ./dist 

# Copy package.json (cần cho 'npm start' nếu dùng)
COPY --chown=node:node package.json ./

RUN mkdir -p /app/logs && chown -R node:node /app # Bỏ comment nếu cần

# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
#   CMD wget -qO- http://127.0.0.1:${PORT}/api/ || exit 1

USER node

EXPOSE 5001

# Chạy trực tiếp bằng node (nhanh hơn npm start)
CMD ["npm", "start"]