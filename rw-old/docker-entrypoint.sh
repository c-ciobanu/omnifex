#!/bin/sh

yarn dlx prisma@5.20.0 migrate deploy --schema=/home/node/app/api/db/schema
yarn dlx @redwoodjs/cli-data-migrate --import-db-client-from-dist

node_modules/.bin/rw-jobs start
node_modules/.bin/rw-server api
