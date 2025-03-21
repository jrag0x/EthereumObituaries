# Ethereum Obituaries

A visual timeline and chart of all the times Ethereum was declared "dead".

## About

Ethereum Obituaries is a project that tracks and visualizes the numerous times Ethereum has been prematurely declared obsolete or "dead" by various sources. This repository contains the code for the website [EthereumObituaries.com](https://ethereumobituaries.com).

## Features

- Interactive chart showing Ethereum's price history alongside "obituary" events
- Chronological timeline of Ethereum "death" declarations
- Each entry includes the date, statement, author, source, and Ethereum price at the time

## Technology Stack

- HTML/CSS/JavaScript
- Highcharts for data visualization

## How to Contribute

For adding new obituaries or contrivuting to the website, please follow the guidelines in [Contribution.md](Contribution.md).

## Local Development

To run this project locally:

1. Clone the repository:
```
git clone https://github.com/jrag0x/EthereumObituaries.git
cd EthereumObituaries
```

2. Since this is a static website, you can use any local server. Here are a few options:
- Using Python (Python 3):
  ```
  python -m http.server 8000
  ```
- Using Node.js (requires `http-server` package):
  ```
  npm install -g http-server
  http-server
  ```
- Using PHP:
  ```
  php -S localhost:8000
  ```
3. Open your browser and navigate to `http://localhost:8000` (or the port number your chosen server uses).
4. Make changes to the files and refresh your browser to see the updates.

## Contact

Created by [Jrag](https://twitter.com/Jrag0x) (with help from AI as I am not a dev) - feel free to contact me!

## Acknowledgements

- Thanks to all contributors who have helped to track these "obituaries"
- Inspired by [Bitcoin Obituaries](https://99bitcoins.com/bitcoin-obituaries/)

## License

MIT License

Copyright (c) 2024 EthereumObituaries

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.