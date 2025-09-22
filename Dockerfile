# syntax=docker/dockerfile:1

# ---- Base versions ----------------------------------------------------------
ARG NODE_VERSION=20

# ---- Deps stage: cài deps cho build (có devDeps) ---------------------------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app

# Cần toolchain để build native addons (bcrypt, sharp, v.v.)
RUN apk add --no-cache python3 make g++ tzdata

# Copy chỉ file lock + package để tối ưu cache
COPY package*.json ./

# Cài đầy đủ dependencies (kèm devDeps) để build TypeScript
RUN npm ci

# ---- Build stage: build tsc -> dist -----------------------------------------
FROM deps AS build
WORKDIR /app

# Copy cấu hình & source
COPY tsconfig.json ./
COPY src ./src

# Build ra dist/
RUN npm run build

# ---- Prod-deps stage: chỉ lấy deps runtime (bỏ devDeps) ---------------------
FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Runner stage: image chạy thực tế --------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# Thêm tzdata để set TZ nếu muốn
RUN apk add --no-cache tzdata && \
    addgroup -S nodejs && adduser -S node -G nodejs

ENV NODE_ENV=production
# Railway sẽ cấp PORT động -> nhớ dùng process.env.PORT trong code
ENV PORT=3000

# Copy deps runtime + build output
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build     /app/dist         ./dist
COPY package*.json ./

# (Tuỳ dự án) tạo thư mục upload/logs nếu app cần ghi file
RUN mkdir -p /app/upload /app/logs && chown -R node:nodejs /app

USER node

EXPOSE 3000

# Healthcheck đơn giản (Railway không bắt buộc nhưng tốt)
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000),r=>{if(r.statusCode<500)process.exit(0);process.exit(1)}).on('error',()=>process.exit(1))"

# Nếu cần chạy migrate mỗi lần start, set ở Start Command của Railway:
#   npm run migrate && npm run start
CMD ["node", "dist/server.js"]