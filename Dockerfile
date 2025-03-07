FROM node:alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/res ./res
COPY --from=build /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/main"]