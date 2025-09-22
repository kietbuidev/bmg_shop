# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

# ---------- deps (cài deps cho build) ----------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ tzdata
COPY package*.json ./
RUN npm ci

# ---------- build (ts -> dist) ----------
FROM deps AS build
WORKDIR /app
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- prod-deps (deps runtime, bỏ devDeps) ----------
FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---------- runner (chạy thật) ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# tzdata là optional; giữ lại nếu app cần set TZ
RUN apk add --no-cache tzdata

ENV NODE_ENV=production
ENV PORT=3000

# copy deps + build output
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build     /app/dist         ./dist
COPY package*.json ./

# tạo thư mục app ghi log/upload nếu cần và gán quyền cho user 'node' có sẵn
RUN mkdir -p /app/upload /app/logs && chown -R node:node /app

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000),r=>{if(r.statusCode<500)process.exit(0);process.exit(1)}).on('error',()=>process.exit(1))"

CMD ["node", "dist/server.js"]