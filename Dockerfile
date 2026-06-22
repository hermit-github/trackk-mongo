# Build Stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production Stage
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "dist/server.js"]