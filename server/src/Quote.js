class Quote {
  id;
  author;
  context;
  text;
  date;

  constructor(id, author, context, text) {
    if (typeof author !== "string" || typeof text !== "string" || (typeof context !== "string" && typeof context !== "undefined")) {
        throw new TypeError("invalid author, text or context");
    }

    this.id = id;
    this.author = author;
    this.context = context ?? '';
    this.text = text;
    this.date = Date.now();
  }
}

module.exports = Quote;
