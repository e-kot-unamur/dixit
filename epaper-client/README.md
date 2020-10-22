# *dixit* - E-paper client documentation

The e-paper client is a Python script made for a Raspberry Pi. It uses [Pillow](https://pillow.readthedocs.io/en/stable/) and [websockets](https://websockets.readthedocs.io/en/stable/intro.html), and requires at least Python 3.7.

It shows available quotes in decreasing order on an e-paper display. Furthermore it connects to the server through websocket and updates immediately when a new quote is posted.

## Environment variables

It can be configured using the following variables :

- `PRODUCTION` - If set to `false`, the script will display new quotes in a window and wont be using the e-paper display at all (default: `true`).
- `TIMEOUT` - Number of seconds to wait before the next quote is shown (default: `60`).
- `HOST` - The address of the server (default: `localhost:8000`).

## Architecture

As the e-paper display makes blocking I/O and to avoid freezing the script, we're creating two threads. The first one listens to websocket frames and sends drawing orders to the second one through a queue.

## Useful links

- <https://www.waveshare.com/wiki/7.5inch_HD_e-Paper_HAT_(B)>: don't miss the *User Guides of Pi* tab.
- <https://www.raspberrypi.org/documentation/usage/gpio/>: helps with connecting the screen to the raspberry pi.
- <https://github.com/waveshare/e-Paper>: an example project by the Waveshare team.
