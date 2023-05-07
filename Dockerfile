# Base stage
FROM registry.gitlab.com/jang0f377/common-images:node-slim AS base

# NOOP

# Dependencies
FROM base AS deps

RUN mkdir /app
WORKDIR /app
COPY package*.json ./
RUN npm install

# Build
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY  . .

RUN npm run build

# Prod
FROM base as production
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 loopback

COPY --from=build --chown=loopback:nodejs /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

USER loopback

CMD [ "npm", "run", "start:prod" ]
