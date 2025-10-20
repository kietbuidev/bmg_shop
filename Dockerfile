# syntax=docker/dockerfile:1
ARG NODE_VERSION=20

# ---------- deps (cài deps cho build) ----------
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ tzdata
COPY package.json package-lock.json* ./

# nếu có lock -> npm ci ; nếu không -> npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --ignore-scripts; \
    else \
      npm install --ignore-scripts; \
    fi

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

RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev --ignore-scripts; \
    else \
      npm install --omit=dev --ignore-scripts; \
    fi

# ---------- runner ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

RUN apk add --no-cache tzdata

ENV NODE_ENV=production
ENV PORT=3000
ENV APP_ENV=develop

# copy deps runtime + build output
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build     /app/dist         ./dist
COPY package.json ./
COPY docker/env ./docker/env
COPY docker/entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# tạo thư mục logs riêng (ngoài dist) và gán quyền cho user node
RUN mkdir -p /app/logs && chown -R node:node /app

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000),r=>{if(r.statusCode<500)process.exit(0);process.exit(1)}).on('error',()=>process.exit(1))"

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
