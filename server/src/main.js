const express = require("express");
const expressWs = require("express-ws");
const QuoteStore = require("./QuoteStore");

const ADDRESS = process.env.ADDRESS ?? "127.0.0.1";
const PORT = parseInt(process.env.PORT ?? "8000");
const QUOTES_DIR = process.env.QUOTES_DIR ?? "quotes";

const store = new QuoteStore(QUOTES_DIR);

const app = express();
app.use(express.json());
expressWs(app);

app.use(express.static('../web-client/public'))

app.get("/quotes", (_, res) => {
    res.json(store.quotes);
});

app.post("/quotes", (req, res) => {
    try {
        const quote = req.body;
        store.save(quote.author, quote.context, quote.text);
        res.sendStatus(200);
    } catch (error) {
        console.error(`invalid quote - ${error}`);
        res.sendStatus(400);
    }
});

app.ws("/quotes/ws", (ws) => {
    function send(quote) {
        if (ws.readyState === 1) {
            ws.send(JSON.stringify(quote));
        }
    }

    function ping() {
        if (ws.readyState === 1) {
            ws.ping("heartbeat");
        }
    }

    store.addCallback(send);
    const pingInterval = setInterval(ping, 30000);
    ws.on("close", () => {
        clearInterval(pingInterval);
        store.removeCallback(send);
    });
});

store.load();
app.listen(PORT, ADDRESS, () => console.info(`listening on ${ADDRESS}:${PORT}`));
