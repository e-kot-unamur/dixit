import { serve, ServerRequest, Response } from "https://deno.land/std/http/server.ts";
import { acceptWebSocket, WebSocket } from "https://deno.land/std/ws/mod.ts";

const PORT = parseInt(Deno.env.get("PORT") ?? "8000");
const PRODUCTION = (Deno.env.get("PRODUCTION") ?? "true") !== "false";
const QUOTES_DIR = "quotes";

const quotes: Quote[] = [];
const senders: Set<Sender> = new Set();

type Sender = (quote: Quote) => void;

class Quote {
  id: number;
  author: string;
  text: string;
  date: number;

  constructor(id: number, author: string, text: string) {
    if (typeof author !== "string" || typeof text !== "string") {
      throw new Error("author or text missing");
    }

    this.id = id;
    this.author = author;
    this.text = text;
    this.date = Date.now();
  }
}

async function loadQuotes() {
  try {
    await Deno.mkdir(QUOTES_DIR);
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }

  for await (const entry of Deno.readDir(QUOTES_DIR)) {
    Deno.readTextFile(`${QUOTES_DIR}/${entry.name}`)
      .then((json) => quotes.push(JSON.parse(json)))
      .catch((error) => console.error(`failed to load quote - ${error}`));
  }
}

function addQuote(quote: Quote) {
  console.log(`new quote: ${JSON.stringify(quote)}`);
  quotes.push(quote);
  for (const send of senders) {
    send(quote);
  }

  const path = `${QUOTES_DIR}/${quote.id}.json`;
  const data = JSON.stringify(quote);
  Deno.writeTextFile(path, data).catch((error) => {
    console.error(`failed to store quote - ${error}`);
  });
}

async function handleRequest(route: string, req: ServerRequest): Promise<Response | void> {
  switch(route) {
    case "GET /quotes":
      return { status: 200, body: JSON.stringify(quotes) };
    
    case "POST /quotes":
      try {
        const body = await Deno.readAll(req.body);
        const json = new TextDecoder("utf-8").decode(body);
        const data = JSON.parse(json);
        const quote = new Quote(quotes.length, data.author, data.text);
        addQuote(quote);
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

  senders.add(send);

  for await (const event of ws) {
    if (typeof event === 'string') {
      try {
        const data = JSON.parse(event);
        const quote = new Quote(quotes.length, data.author, data.text);
        addQuote(quote);
      } catch (error) {
        console.error(`invalid quote - ${error}`);
      }
    }
  }

  senders.delete(send);
}

if (import.meta.main) {
  await loadQuotes();
  console.info(`listening on 0.0.0.0:${PORT} (${PRODUCTION ? "production" : "development"} mode)`);

  for await (const req of serve({ port: PORT })) {
    const route = `${req.method} ${req.url}`;
    handleRequest(route, req).then(res => {
      if (res) {
        if (!PRODUCTION) {
          res.headers = new Headers({ "Access-Control-Allow-Origin": "*" });
        }

        console.log(`[${res.status ?? 200}] ${route}`);
        req.respond(res);
      }
    });
  }
}
