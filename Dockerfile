# syntax=docker/dockerfile:1

FROM node:20-slim AS app

# Cập nhật npm để tránh notice (từ vấn đề trước)
RUN npm install -g npm@latest

WORKDIR /app

# Cài toolchain nếu cần build native (bcrypt), nhưng với slim thì ít cần hơn Alpine
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy và cài deps (gộp deps + prod-deps)
COPY package*.json ./
RUN npm ci --omit=dev \
 && npm rebuild bcrypt --build-from-source \
 && npm cache clean --force

# Compile TS (gộp build stage)
COPY tsconfig.json ./
COPY src ./src
ENV NODE_OPTIONS=--enable-source-maps
RUN npx tsc --project tsconfig.json
# Nếu có docs, copy thủ công (hoặc bỏ nếu không cần)
# RUN if [ -d src/docs ]; then mkdir -p dist/docs && cp -r src/docs/. dist/docs/; fi

# Setup runtime
ENV NODE_ENV=production
ENV TZ=Asia/Ho_Chi_Minh
ENV PORT=5001
RUN mkdir -p /app/logs

# Copy package.json cuối để checksum thay đổi
COPY package.json ./

# Chạy với user node cho security (giữ nguyên)
USER node

EXPOSE 5001

CMD ["npm", "start"]