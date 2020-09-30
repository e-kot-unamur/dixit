export default class Quote {
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
