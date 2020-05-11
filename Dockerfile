FROM node:12-slim

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm i --only=production

COPY ./src ./src

EXPOSE 7070

CMD ["npm", "start"]