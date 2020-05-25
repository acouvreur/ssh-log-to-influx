FROM node:10-alpine AS base
WORKDIR /app

COPY package*.json ./

FROM base AS build
RUN apk add --no-cache --virtual .gyp python make g++
# install dependencies
RUN npm ci
# build sources
COPY . .
RUN npm run build


FROM base AS release
RUN npm ci --production
COPY --from=build /app/dist ./dist
EXPOSE 7070
CMD ["node", "dist/index.js"]
