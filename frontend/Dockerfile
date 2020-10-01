FROM node:latest AS builder

WORKDIR /dixit
COPY . .
RUN npm install
RUN npm run build


FROM nginx:alpine

COPY app.conf /etc/nginx/conf.d
COPY --from=builder /dixit/public /usr/share/nginx/html
