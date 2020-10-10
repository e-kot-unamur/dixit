#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import logging
import json
import time
import asyncio
import threading
import urllib.request
import websockets
import queue
import textwrap
from PIL import Image, ImageDraw, ImageFont
from waveshare_epd import epd7in5b_HD as epd

PRODUCTION = False
QUOTES_URL = 'http://localhost:8001/quotes'
WEBSOCKET_URL = 'ws://localhost:8001/ws'
PLACEHOLDER_QUOTE = {'id': 0, 'author': 'version 1.0.0', 'text': 'dixit', 'date': 0}
TIMEOUT = 6


def main():
    logging.basicConfig(level=logging.INFO)

    draws = queue.Queue()

    drawing = threading.Thread(target=draw, args=[draws])
    drawing.running = True
    drawing.start()

    try:
        asyncio.run(listen(draws))
    except KeyboardInterrupt:
        logging.info('Keyboard interrupt')
    except Exception as error:
        logging.critical(f'A fatal error occurred: {error}')

    logging.info('Stopping drawing thread')
    drawing.running = False


async def listen(draws):
    draws.put_nowait(PLACEHOLDER_QUOTE)

    quotes = get_quotes(QUOTES_URL)
    quote_i = 0

    logging.info(f'Got {len(quotes)} quotes')

    async with websockets.connect(WEBSOCKET_URL) as socket:
        while not socket.closed:
            try:
                message = await asyncio.wait_for(socket.recv(), timeout=TIMEOUT)
                quote = json.loads(message)
                quote_i = len(quotes)
                quotes.append(quote)

            except asyncio.TimeoutError:
                if len(quotes) > 0:
                    quote_i = (quote_i - 1) % len(quotes)
                    quote = quotes[quote_i]
                else:
                    quote = PLACEHOLDER_QUOTE

            draws.put_nowait(quote)


def get_quotes(url):
    request = urllib.request.urlopen(url)
    data = request.read().decode('utf-8')
    return json.loads(data)


def draw(draws):
    # Resources
    text_font = ImageFont.truetype('fonts/Ubuntu-C.ttf', 48)
    author_font = ImageFont.truetype('fonts/Ubuntu-L.ttf', 32)

    total_w, total_h = 880, 528
    atom_w, atom_h = author_font.getsize('e')

    author_w, author_h = total_w, atom_h + 32
    text_w, text_h = total_w, total_h - author_h

    cols, lines = text_w // atom_w, text_h // atom_h

    black_image = Image.new('1', (total_w, total_h), color=255)
    red_image = Image.new('1', (total_w, total_h), color=255) if PRODUCTION else black_image
    black_draw = ImageDraw.Draw(black_image)
    red_draw = ImageDraw.Draw(red_image) if PRODUCTION else black_draw

    # Initialization
    display = epd.EDP()
    display.init()

    # Main loop
    thread = threading.current_thread()
    while thread.running:
        try:
            quote = draws.get(timeout=5)
        except queue.Empty:
            # This is meant to allow the thread to stop even if the queue is empty
            continue

        logging.info(f"Drawing quote {quote['id']}")

        # Render text
        text = textwrap.fill(quote['text'], width=cols, max_lines=lines, replace_whitespace=False)
        w, h = text_font.getsize_multiline(text, spacing=0)
        pos = (text_w - w) / 2, (text_h - h) / 2
        black_draw.text(pos, text=text, font=text_font, fill=0, spacing=0, align='center')

        # Render author
        author = quote['author']
        w, h = author_font.getsize(author)
        pos = (author_w - w) / 2, text_h + (author_h - h) / 2
        red_draw.text(pos, text=author, font=author_font, fill=0)

        # Display on screen
        if PRODUCTION:
            display.display(display.getbuffer(black_image), display.getbuffer(red_image))
        else:
            black_image.show()

        # Clear for next drawing
        black_draw.rectangle((0, 0, total_w, total_h), fill=255)
        red_draw.rectangle((0, 0, total_w, total_h), fill=255)

        logging.info('Drawing done')

    # Sleep
    display.sleep()
    display.Dev_exit()


if __name__ == '__main__':
    main()
