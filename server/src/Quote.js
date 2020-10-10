class Quote {
  id;
  author;
  text;
  date;

  constructor(id, author, text) {
    if (typeof author !== "string" || typeof text !== "string") {
        throw new Error("author or text missing");
    }

    this.id = id;
    this.author = author;
    this.text = text;
    this.date = Date.now();
  }
}

module.exports = Quote;
