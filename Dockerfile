FROM node:22-alpine AS base

WORKDIR /app

FROM base AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM builder AS builder-server

RUN pnpm add -g turbo@2.5.8

COPY . .

RUN pnpm turbo prune server --docker

FROM builder AS builder-web

RUN pnpm add -g turbo@2.5.8

COPY . .

RUN pnpm turbo prune web --docker

FROM builder AS installer-server

COPY --from=builder-server /app/out/json/ .
RUN pnpm install

COPY --from=builder-server /app/out/full/ .
RUN pnpm turbo build

RUN pnpm --filter=server --prod --legacy deploy pruned

FROM builder AS installer-web

COPY --from=builder-web /app/out/json/ .
RUN pnpm install

ARG VITE_SERVER_URL
ENV VITE_SERVER_URL=${VITE_SERVER_URL}

COPY --from=builder-web /app/out/full/ .
RUN pnpm turbo build

FROM base AS runner-server

COPY --from=installer-server /app/pruned/node_modules ./node_modules
COPY --from=installer-server /app/pruned/dist ./dist

COPY --from=builder-server /app/out/full/packages/db ./packages/db

CMD ["sh", "-c", "cd packages/db && npx prisma migrate deploy && cd ../.. && node dist/index.js"]

FROM nginx:mainline-alpine AS runner-web

WORKDIR /app

COPY --from=installer-web /app/apps/web/nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=installer-web /app/apps/web/dist /app/www

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
