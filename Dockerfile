FROM node:14-alpine

WORKDIR /app

COPY . .

WORKDIR /app/server

RUN npm install 

WORKDIR /app/web-client

RUN npm install
RUN npm run build

WORKDIR /app/server

EXPOSE 80

CMD ["npm","run","start"]