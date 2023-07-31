FROM node:18-alpine

COPY pnpm-lock.yaml ./

COPY package.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . . 

CMD [ "pnpm", "run", "deploy" ]