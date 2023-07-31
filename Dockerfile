FROM node:18-alpine

COPY pnpm-lock.yaml ./

COPY package.json ./

RUN npm install -g pnpm

RUN pnpm install

RUN pnpm prisma migrate dev --name init 

COPY . .

CMD [ "pnpm", "run", "start" ]