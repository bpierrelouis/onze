ARG NODE_VERSION=18.17.1

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . ./
RUN npm run build

CMD npm run start
