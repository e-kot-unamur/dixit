// 
export async function getQuotes() {
  const response = await fetch('/quotes');
  const quotes = await response.json();
  return quotes;
}

export function postQuote(text, author, context) {
  fetch('/quotes', {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ text, author , context}),
  });
}

// WebSocket
const ws = new WebSocket(`${location.origin.replace('http', 'ws')}/quotes/ws`);
let password = '';

ws.onclose = () => {
  setTimeout(() => location.reload(), 5000);
};

export function onQuote(callback) {
  ws.addEventListener('message', (message) => {
    const quote = JSON.parse(message.data);
    callback(quote);
  });
}
export function offQuote(callback) {
  ws.removeEventListener('message', callback)
}

export function getAuthors(quotes) {
  let unfilteredAuthors = quotes.map(q => q.author);
  let authors = filterAuthors(unfilteredAuthors)
  return authors;
}

export function checkPass(callback){
  ws.addEventListener('message', (event) => {
    const resp = JSON.parse(event.data)
    callback(resp.exists);
  });
};

export function checkPassword(event) {
  password = event.target.value;
  ws.send(JSON.stringify({message:"check-env-var", variable:password}));
}

//returns Map("value",#occurence) of an array
function filterAuthors(arr) {
  let myMap = new Map();
  for (const element of arr) {
    if (myMap.has(element.trim())) {
      myMap.set(element.trim(), myMap.get(element.trim()) + 1);
    }
    else {
      myMap.set(element.trim(), 1)
    }
  }
  return myMap;
}



