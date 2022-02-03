# Harmony Explorer frontend

## Requirements

### Node.js 16.13.2 LTS
Download and install Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)

### yarn 1.22.17

```
npm install --global yarn
```

## Dev Environment

### First Install

1) Clone repo:

```bash
git clone https://github.com/harmony-one/explorer-v2-frontend.git
```
2) Install dependencies:
```bash
cd explorer-v2-frontend
yarn install
```
3) Run project:
```bash
yarn start
```
4) Open app page http://localhost:3000/

### Configuring app

1) Create a new file: `.env.local`
2) Copy env variables from `.env.example` to newly created file `.env.local`
3) Setup custom env variables values and restart the app

### Build
To create production build run command:
```
yarn build
```
