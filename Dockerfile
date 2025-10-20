# syntax=docker/dockerfile:1

ARG NODE_VERSION=20

# Install all dependencies (including dev) so we can build TypeScript
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ tzdata
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --ignore-scripts; \
    else \
      npm install --ignore-scripts; \
    fi

# Compile TypeScript sources to dist/
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc --project tsconfig.json
# Copy any non-TS assets that should ship with the build
RUN if [ -d src/docs ]; then mkdir -p dist/docs && cp -r src/docs/. dist/docs/; fi

# Install only production dependencies
FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev --ignore-scripts; \
    else \
      npm install --omit=dev --ignore-scripts; \
    fi

# Minimal runtime image
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5001

RUN apk add --no-cache tzdata

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# Prepare writable directories for logs
RUN mkdir -p /app/logs && chown -R node:node /app

USER node

EXPOSE 5001

CMD ["node", "dist/server.js"]
