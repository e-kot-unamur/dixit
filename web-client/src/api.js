// HTTP
export async function getQuotes() {
    const response = await fetch('/quotes');
    const quotes = await response.json();
    return quotes;
}

export function postQuote(text, author) {
    fetch('quotes', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ text, author }),
    });
}

// WebSocket
const ws = new WebSocket(`${location.origin.replace('http', 'ws')}/ws`);

ws.onclose = () => {
    setTimeout(() => location.reload(), 5000);
};

export function onQuote(callback) {
    ws.onmessage = (message) => {
        const quote = JSON.parse(message.data);
        callback(quote);
    };
}
