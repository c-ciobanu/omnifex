#!/bin/sh

yarn dlx prisma migrate deploy --schema=/home/node/app/api/db/schema.prisma
yarn dlx @redwoodjs/cli-data-migrate --import-db-client-from-dist

node_modules/.bin/rw-jobs start
node_modules/.bin/rw-server api
