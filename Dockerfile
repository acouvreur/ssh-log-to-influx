FROM node:12-slim

WORKDIR /app

COPY package.json package.json

RUN npm i

COPY ./ .

EXPOSE 7070

CMD ["node", "src/index.js"]