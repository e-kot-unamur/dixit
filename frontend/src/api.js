// HTTP
const production = false;
const host = production
    ? location.origin
    : "http://localhost:8001";

export async function getQuotes() {
    const response = await fetch(`${host}/quotes`);
    const quotes = await response.json();
    return quotes;
}

export function postQuote(text, author) {
    fetch(`${host}/quotes`, {
        method: 'POST',
        body: JSON.stringify({ text, author }),
    });
}

// WebSocket
const wsHost = host.replace('http', 'ws');
const ws = new WebSocket(`${wsHost}/ws`);

// export function postQuote(text, author) {
//     ws.send(JSON.stringify({ text, author }));
// }

export function onQuote(callback) {
    ws.onmessage = (message) => {
        const quote = JSON.parse(message.data);
        callback(quote);
    };
}
