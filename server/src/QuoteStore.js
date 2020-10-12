const fs = require("fs/promises");
const Quote = require("./Quote");

class QuoteStore {
  path;
  quotes = [];
  counter = 0;
  callbacks = new Set();

  constructor(path) {
    this.path = path;
  }

  async load() {
    await fs.mkdir(this.path, { recursive: true });

    for (const entry of await fs.readdir(this.path)) {
      const json = await fs.readFile(`${this.path}/${entry}`, "utf8");
      const quote = JSON.parse(json);
      this.quotes.push(quote);
      this.counter = Math.max(this.counter, quote.id);
    }

    this.quotes.sort((a, b) => a.id - b.id);
    console.info(`${this.quotes.length} quote(s) loaded from ${this.path}/`);
  }

  save(author, text) {
    const quote = new Quote(++this.counter, author, text);
    this.quotes.push(quote);

    console.info(`storing "${text}" by "${author}"`);
    for (const callback of this.callbacks) {
      callback(quote);
    }

    const path = `${this.path}/${quote.id}.json`;
    const data = JSON.stringify(quote);
    fs.writeFile(path, data, "utf8").catch((error) => {
      console.error(`failed to store quote - ${error}`);
    });
  }

  addCallback(callback) {
    this.callbacks.add(callback);
  }

  removeCallback(callback) {
    this.callbacks.delete(callback);
  }
}

module.exports = QuoteStore;
