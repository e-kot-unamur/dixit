import { serve } from "https://deno.land/std/http/server.ts";

class Message {
  author: string;
  text: string;
  date: number;

  constructor(author: string, text: string) {
    if (!author || !text) {
      throw new Error('invalid message');
    }

    this.author = author;
    this.text = text;
    this.date = Date.now();
  }
}

const server = serve({ port: 8000 });
console.log("http://localhost:8000/");

// TODO : Load file
const messages = [];

for await (const req of server) {
  switch (req.method) {
    case 'GET':
      req.respond({ status: 200, body: JSON.stringify(messages) });
      break;

    case 'POST':
      try {
        const body = await Deno.readAll(req.body);
        const json = new TextDecoder('utf-8').decode(body);
        const data = JSON.parse(json);
        const message = new Message(data.author, data.text);
        console.log(`Received ${json}`);
        messages.push(message);
        req.respond({ status: 200 });
      } catch {
        console.error('Bad request');
        req.respond({ status: 400 });
      }
      break;

    default:
      console.error('Unsupported method');
      req.respond({ status: 400 });
      break;
  }
}
