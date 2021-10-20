# *dixit* - The quote collector

> From Latin dīxit (“he or she has said”).

Automated quote collector with a web interface and an e-paper carousel.

## Getting started

Installation and usage requires at least Node 14 (for the web server) and Python 3.7 (for the e-paper client).

The e-paper client has been designed for the [Waveshare's 7.5" HD HAT B](https://www.waveshare.com/7.5inch-hd-e-paper-hat-b.htm) but could be easily adapted to other models.

### Installation

```sh
# Clone this repo
git clone https://github.com/e-kot-unamur/dixit.git

# Download dependencies for the server
cd dixit/server
npm install

# Build static files for the web client
cd ../web-client
npm install
npm run build

# Create the virtual environment for the e-paper client
cd ../epaper-client
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cd ..
```

### Usage

To start the server (under the `server` directory) :

```sh
PORT=80 npm run start
```

To start the e-paper carousel (in the `epaper-client` directory, under the previously created virtual environment) :

```sh
HOST='localhost:80' TIMEOUT=240 python main.py
```

Depending on your distribution, you may need to install additional packages for the python client to run (as it's using [Pillow](https://pillow.readthedocs.io/en/stable/index.html)). Please refer to [their documentation](https://pillow.readthedocs.io/en/stable/installation.html) if you need help.

For any further documentation, please refer to the [server](server/README.md), the [web client](web-client/README.md), or the [e-paper client](epaper-client/README.md)'s readmes.

## License

This software is published under the [MIT license](LICENSE).

It uses an [e-paper library](epaper-client/waveshare_epd) from the *Waveshare team* also published under the MIT license.
