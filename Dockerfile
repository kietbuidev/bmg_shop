# ---------- Runner ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

# cần wget cho HEALTHCHECK (alpine không luôn có)
RUN apk add --no-cache tzdata wget

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

RUN mkdir -p /app/logs && chown -R node:node /app

USER node
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "dist/server.js"]