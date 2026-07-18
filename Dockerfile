# ---- Client build ----
FROM node:22-alpine AS client-build
WORKDIR /app

COPY client/package.json client/package-lock.json ./client/
RUN npm ci --prefix client

COPY client ./client

ARG VITE_API_URL=/api
ARG VITE_SOCKET_URL=
ENV VITE_API_URL=$VITE_API_URL \
    VITE_SOCKET_URL=$VITE_SOCKET_URL

RUN npm run build --prefix client

# ---- Server runtime ----
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --omit=dev --prefix server && npm cache clean --force

COPY server ./server
COPY --from=client-build /app/client/dist ./client/dist

WORKDIR /app/server
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "src/server.js"]
