# base
# ----
FROM node:20-bookworm-slim AS base

RUN corepack enable

# We tried to make the Dockerfile as lean as possible. In some cases, that means we excluded a dependency your project needs.
# By far the most common is Python. If you're running into build errors because `python3` isn't available,
# uncomment the line below here and in other stages as necessary:
RUN apt-get update && apt-get install -y \
    openssl \
    # python3 make gcc \
    && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node package.json .
COPY --chown=node:node packages/common/package.json packages/common/
COPY --chown=node:node api/package.json api/
COPY --chown=node:node web/package.json web/
COPY --chown=node:node yarn.lock .

RUN mkdir -p /home/node/.yarn/berry/index
RUN mkdir -p /home/node/.cache

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn install

COPY --chown=node:node redwood.toml .
COPY --chown=node:node graphql.config.js .
COPY --chown=node:node .env.defaults .env.defaults

# api build
# ---------
FROM base AS api_build

# If your api side build relies on build-time environment variables,
# specify them here as ARGs. (But don't put secrets in your Dockerfile!)
#
# ARG MY_BUILD_TIME_ENV_VAR

COPY --chown=node:node packages packages
COPY --chown=node:node api api
RUN yarn build:packages
RUN yarn rw build api

# web prerender build
# -------------------
FROM api_build AS web_build_with_prerender

COPY --chown=node:node web web
RUN yarn rw build web

# web build
# ---------
FROM base AS web_build

COPY --chown=node:node packages packages
COPY --chown=node:node web web
RUN yarn build:packages
RUN yarn rw build web --no-prerender

# api serve
# ---------
FROM node:20-bookworm-slim AS api_serve

RUN corepack enable

RUN apt-get update && apt-get install -y \
    openssl \
    # python3 make gcc \
    && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node package.json .
COPY --chown=node:node api/package.json api/
COPY --chown=node:node yarn.lock .

RUN mkdir -p /home/node/.yarn/berry/index
RUN mkdir -p /home/node/.cache

COPY --chown=node:node --from=api_build /home/node/app/packages/common /home/node/app/packages/common

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn workspaces focus api --production

COPY --chown=node:node redwood.toml .
COPY --chown=node:node graphql.config.js .
COPY --chown=node:node .env.defaults .env.defaults

COPY --chown=node:node --from=api_build /home/node/app/api/dist /home/node/app/api/dist
COPY --chown=node:node --from=api_build /home/node/app/api/db /home/node/app/api/db
COPY --chown=node:node --from=api_build /home/node/app/node_modules/.prisma /home/node/app/node_modules/.prisma

COPY --chown=node:node docker-entrypoint.sh .

ENV NODE_ENV=production

ENTRYPOINT [ "./docker-entrypoint.sh" ]

# web serve
# ---------
FROM node:20-bookworm-slim AS web_serve

RUN corepack enable

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node package.json .
COPY --chown=node:node web/package.json web/
COPY --chown=node:node yarn.lock .

RUN mkdir -p /home/node/.yarn/berry/index
RUN mkdir -p /home/node/.cache

COPY --chown=node:node --from=web_build /home/node/app/packages/common /home/node/app/packages/common

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
    --mount=type=cache,target=/home/node/.cache,uid=1000 \
    CI=1 yarn workspaces focus web --production

COPY --chown=node:node redwood.toml .
COPY --chown=node:node graphql.config.js .
COPY --chown=node:node .env.defaults .env.defaults

COPY --chown=node:node --from=web_build /home/node/app/web/dist /home/node/app/web/dist

ENV NODE_ENV=production \
    API_PROXY_TARGET=http://api:8911

# We use the shell form here for variable expansion.
CMD "node_modules/.bin/rw-web-server" "--api-proxy-target" "$API_PROXY_TARGET"

# console
# -------
FROM base AS console

# To add more packages:
#
# ```
# USER root
#
# RUN apt-get update && apt-get install -y \
#     curl
#
# USER node
# ```

COPY --chown=node:node api api
COPY --chown=node:node web web
COPY --chown=node:node scripts scripts

RUN yarn rw prisma generate
