import { serve, ServerRequest, Response } from "https://deno.land/std/http/server.ts";
import { acceptWebSocket, WebSocket } from "https://deno.land/std/ws/mod.ts";

class Message {
  id: number;
  author: string;
  text: string;
  date: number;

  constructor(id: number, author: string, text: string) {
    if (typeof author !== 'string' || typeof text !== 'string') {
      throw new Error('invalid message');
    }

    this.id = id;
    this.author = author;
    this.text = text;
    this.date = Date.now();
  }
}

async function handleRequest(route: string, req: ServerRequest): Promise<Response | void> {
  switch(route) {
    case 'GET /messages':
      return { body: JSON.stringify(messages) };
    
    case 'POST /messages':
      try {
        const body = await Deno.readAll(req.body);
        const json = new TextDecoder('utf-8').decode(body);
        const data = JSON.parse(json);
        const message = new Message(messages.length, data.author, data.text);
        messages.push(message);
        return {};
      } catch {
        return { status: 400 };
      }
    
    case 'GET /ws':
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
  for await (const event of ws) {
    if (typeof event === 'string') {
      try {
        const data = JSON.parse(event);
        const message = new Message(messages.length, data.author, data.text);
        messages.push(message);
      } catch {

      }
    }
  }
}

// TODO : Load file
const messages: Message[] = [];

for await (const req of serve({ port: 8000 })) {
  const route = `${req.method} ${req.url}`;
  handleRequest(route, req).then(res => {
    if (res) {
      console.log(`[${res.status ?? 200}] ${route}`);
      req.respond(res);
    }
  });
}
