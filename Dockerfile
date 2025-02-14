FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install --force && npm i -g serve

COPY . .

RUN export NODE_OPTIONS="--max-old-space-size=8192" && npm run build

FROM nginx:latest

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx","-g","daemon off;"]
