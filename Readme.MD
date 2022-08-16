# DexScreener watchlist

Fetch all your watchlists at once

## Usage

Go to dexscreener and export your watchlist using the console command :

```js
window.localStorage.getItem('dexscreener.watchlist');
```

Copy the result inside the form and press Load

## Remote
https://drtex0.github.io/dexscreener-watchlist/

<img width="1387" alt="image" src="https://user-images.githubusercontent.com/98310792/184991565-6060dfa4-afa0-4ec2-b71a-f24ebb11f289.png">


## Local

```
yarn install
yarn dev
```

## Dev

Usage of :

- Vite (builder)
- Mantine (UI)
- Zod (schema validation)
- Jest (testing)
- Eslint + prettier
