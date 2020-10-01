FROM hayd/alpine-deno:latest

WORKDIR /dixit
COPY . .
RUN deno cache main.ts
CMD ["run", "--allow-env", "--allow-read=/home/deno", "--allow-write=/home/deno", "--allow-net", "main.ts"]
