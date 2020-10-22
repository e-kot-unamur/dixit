# *dixit* - Server documentation

The server is a simple Node / Express application. It requires at least Node 14.0.0.

## Environment variables

It can be configured using the following variables :

- `PORT` - The port the server is listening to (default: `8000`).
- `PUBLIC_DIR` - Directory containing static files to be served (default: `public`).
- `QUOTES_DIR` - Directory in which the quotes are stored (default: `quotes`).

## Routes

The following routes are available :

- `GET /` - Base route for static files.
- `GET /quotes` - Return the complete list of quotes as a JSON list.
- `POST /quotes` - Create a new quote. This route takes an `author` field and a `text` field in a JSON object.
- `GET /ws` - Websocket route that broadcasts newly received quotes as JSON objects (see the format below).

## Quote JSON format

Each quote is stored as a separate JSON file under the quotes directory. The following code is an example of a random quote :

```json
{
    "id": 3,
    "author": "John Doe, thinking about life",
    "text": "Is the universe a donut?",
    "date": 1603371421079
}
```

The `id` field is a unique identifier, the server will start at 1 and auto-increment it when a new quote is received. The `date` field is the timestamp at which the quote has been received (elapsed milliseconds since epoch).

You can freely delete or edit any quote file but the server must be restarted for the action to take effect.
