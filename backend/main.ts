import { serve, ServerRequest, Response } from "https://deno.land/std/http/server.ts";
import { acceptWebSocket, WebSocket } from "https://deno.land/std/ws/mod.ts";
import type Quote from "./Quote.ts";
import QuoteStore from "./QuoteStore.ts";

const PORT = parseInt(Deno.env.get("PORT") ?? "8000");
const PRODUCTION = (Deno.env.get("PRODUCTION") ?? "true") !== "false";
const QUOTES_DIR = Deno.env.get("QUOTES_DIR") ?? "quotes";

const quotes = new QuoteStore(QUOTES_DIR);

async function handleRequest(route: string, req: ServerRequest): Promise<Response | void> {
  switch(route) {
    case "GET /quotes":
      return { status: 200, body: quotes.toJson() };

    case "POST /quotes":
      try {
        const body = await Deno.readAll(req.body);
        const json = new TextDecoder("utf-8").decode(body);
        const data = JSON.parse(json);
        quotes.save(data.author, data.text);
        return { status: 200 };
      } catch (error) {
        console.error(`invalid quote - ${error}`);
        return { status: 400 };
      }

    case "GET /ws":
      const { conn, r: bufReader, w: bufWriter, headers } = req;
      acceptWebSocket({ conn, bufReader, bufWriter, headers })
        .then(handleSocket)
        .catch(console.error);
      return;

    default:
      return { status: 404 };
  }
}

async function handleSocket(ws: WebSocket): Promise<void> {
  function send(quote: Quote) {
    ws.send(JSON.stringify(quote));
  }

  quotes.addCallback(send);
  for await (const _ of ws) {} // wait to be closed
  quotes.removeCallback(send);
}

if (import.meta.main) {
  await quotes.load();
  console.info(`listening on 0.0.0.0:${PORT} (${PRODUCTION ? "production" : "development"} mode)`);

  for await (const req of serve({ port: PORT })) {
    const route = `${req.method} ${req.url}`;
    handleRequest(route, req).then(res => {
      if (res) {
        if (!PRODUCTION) {
          res.headers = new Headers({ "Access-Control-Allow-Origin": "*" });
        }

        req.respond(res);
        console.log(`[${res.status ?? 200}] ${route}`);
      }
    });
  }
}
