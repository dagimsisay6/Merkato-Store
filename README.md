# Merkato Store

Africa & Middle East's marketplace — built with Next.js (client) and Node/Express/MongoDB (server).

## Project Structure

```
merkato-store/
├── client/   → Next.js frontend
└── server/   → Node + Express + MongoDB API
```

## Getting Started

### Install dependencies
```bash
npm run install:all
```

### Run client (Next.js)
```bash
npm run client
# runs on http://localhost:3000
```

### Run server (Express API)
```bash
npm run server
# runs on http://localhost:8000
```

## Environment Variables

- Copy `client/.env.example` → `client/.env.local` and fill in values
- Copy `server/.env.example` → `server/.env` and fill in values
