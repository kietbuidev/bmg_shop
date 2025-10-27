# syntax=docker/dockerfile:1
ARG NODE_VERSION=20
ARG APP_VERSION=dev
ARG GIT_SHA=local

FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ tzdata
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --ignore-scripts; else npm i --ignore-scripts; fi

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --ignore-scripts; else npm i --omit=dev --ignore-scripts; fi

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
RUN apk add --no-cache tzdata wget \
 && addgroup -S nodegrp && adduser -S node -G nodegrp
ENV NODE_ENV=production
ENV PORT=5000
ENV APP_VERSION=${APP_VERSION}
ENV GIT_SHA=${GIT_SHA}

LABEL org.opencontainers.image.title="bmg-kaylin-be" \
      org.opencontainers.image.version="${APP_VERSION}" \
      org.opencontainers.image.revision="${GIT_SHA}"

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
RUN mkdir -p /app/logs && chown -R node:nodegrp /app
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1
CMD ["node", "dist/server.js"]