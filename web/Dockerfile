FROM node:20-alpine AS build
WORKDIR /app
COPY web/package*.json ./
RUN npm ci
COPY web/ .
ENV CI=false
RUN npm run build && test -f /app/build/index.html

FROM nginx:alpine
COPY web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html/
RUN test -f /usr/share/nginx/html/index.html
EXPOSE 80
