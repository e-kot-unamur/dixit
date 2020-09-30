import Quote from "./Quote.ts";

type Callback = (quote: Quote) => void;

export default class QuoteStore {
  path: string;
  quotes: Quote[] = [];
  counter: number = 0;
  callbacks: Set<Callback> = new Set();

  constructor(path: string) {
    this.path = path;
  }

  async load() {
    try {
      await Deno.mkdir(this.path);
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }

    for await (const entry of Deno.readDir(this.path)) {
      const json = await Deno.readTextFile(`${this.path}/${entry.name}`);
      const quote = JSON.parse(json);
      this.quotes.push(quote);
      this.counter = Math.max(this.counter, quote.id);
    }

    console.info(`${this.quotes.length} quote(s) loaded from ${this.path}/`);
  }
  
  save(author: string, text: string) {
    const quote = new Quote(++this.counter, author, text);
    this.quotes.push(quote);

    for (const callback of this.callbacks) {
      callback(quote);
    }

    const path = `${this.path}/${quote.id}.json`;
    const data = JSON.stringify(quote);
    Deno.writeTextFile(path, data).catch((error) => {
      console.error(`failed to store quote - ${error}`);
    });
  }

  toJson(): string {
    return JSON.stringify(this.quotes)
  }

  addCallback(callback: Callback) {
    this.callbacks.add(callback);
  }

  removeCallback(callback: Callback) {
    this.callbacks.delete(callback);
  }
}
