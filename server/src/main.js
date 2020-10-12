const express = require("express");
const expressWs = require("express-ws");
const QuoteStore = require("./QuoteStore");

const PORT = parseInt(process.env.PORT ?? "8000");
const PUBLIC_DIR = process.env.PUBLIC_DIR ?? "public";
const QUOTES_DIR = process.env.QUOTES_DIR ?? "quotes";

const store = new QuoteStore(QUOTES_DIR);
const app = express();

app.use(express.static(PUBLIC_DIR));
app.use(express.json());
expressWs(app);

app.get("/quotes", (_, res) => {
    res.json(store.quotes);
});

app.post("/quotes", (req, res) => {
    try {
        const quote = req.body;
        store.save(quote.author, quote.text);
        res.sendStatus(200);
    } catch (error) {
        console.error(`invalid quote - ${error}`);
        res.sendStatus(400);
    }
});

app.ws("/ws", (ws) => {
    function send(quote) {
        ws.send(JSON.stringify(quote));
    }

    store.addCallback(send);
    ws.on("close", () => store.removeCallback(send));
});

store.load().then(() => {
    app.listen(PORT, () => {
        console.info(`listening on 0.0.0.0:${PORT}`);
    });
});
