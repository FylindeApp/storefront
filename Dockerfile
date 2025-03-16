FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat bash curl inotify-tools git

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY ./auth-sdk/fylinde-auth-sdk-1.0.1.tgz /auth-sdk/
RUN npm install --ignore-scripts --legacy-peer-deps \
    styled-components \
    @types/styled-components \
    @styled-system/theme-get \
    @types/styled-system__theme-get \
    axios-cache-interceptor@1.6.2 \
    aframe \
    aframe-extras \
    date-fns \
    @types/date-fns \
    next

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# GraphQL Codegen delayed to runtime explicitly

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=development
ENV NEXT_PUBLIC_SALEOR_API_URL="http://saleor:8000/graphql/"
ENV SENTRY_RELEASE=my-app@1.0.0

RUN apk add --no-cache inotify-tools curl
COPY --from=builder /app /app

# ⚡ Fix permission issues explicitly
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs nodejs \
    && mkdir -p /app/.next/cache /app/node_modules /app/logs \
    && chown -R nextjs:nodejs /app/.next /app/node_modules /app /app/logs \
    && chmod -R 777 /app/.next /app/node_modules /app /app/logs

USER nextjs

CMD ["sh", "./start-storefront.sh"]
