FROM node:18-alpine AS builder

# Set env dynamic_branch
ARG dynamic_branch
ENV env_dynamic_branch=$dynamic_branch

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json /app

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Copy env
RUN cp docker/env/.env.${env_dynamic_branch} ./.env

# Build
RUN npm run build
#--------------------------------
FROM node:18-alpine AS runner

# Create and set the working directory
WORKDIR /app

# RUN npm install -g npm@10.8.2

# Copy source build
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/.env ./.env
# COPY --from=builder /app/package.json ./package.json
COPY  --from=builder /app/ ./
 
# Expose the port the app runs on
EXPOSE 3000

# Install timezone
RUN apk add --no-cache tzdata

# Actual timezone en variable set
ENV TZ Asia/Ho_Chi_Minh

# Command to start the development server
CMD ["npm", "start"]
