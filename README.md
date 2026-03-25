# Omnifex

## Local setup requirements

- **Node.js**
- **pnpm**
- **Docker**

## Local setup

```bash
git clone git@github.com:c-ciobanu/omnifex.git

cd omnifex

pnpm install

cp .env.example .env
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env

pnpm db:migrate
pnpm dev
```
