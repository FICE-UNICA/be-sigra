FROM node:22.20-alpine3.21

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000


CMD ["npm", "run", "start:dev"]
