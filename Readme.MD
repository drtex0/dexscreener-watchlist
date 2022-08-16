# DexScreener watchlist

Fetch all your watchlists at once

## Usage

Go to dexscreener and export your watchlist using the console command :

```js
window.localStorage.getItem('dexscreener.watchlist');
```

Copy the result inside the form and press Load

## Start

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
