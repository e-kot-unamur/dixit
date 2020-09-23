FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm install 
RUN npm install -g serve

RUN npm run build 

EXPOSE 8000

CMD ["serve", "-p", "5000", "-s", "public/"]
