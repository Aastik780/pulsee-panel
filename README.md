<div align="center">

# Pulsee Panel

**Live monitoring dashboard for the [Pulsee](https://github.com/Aastik780/Discord-music-bot) Discord music bot.**

Status, now playing, queue and system stats — auto-refreshing every 5 seconds.

[![CI](https://github.com/Aastik780/pulsee-panel/actions/workflows/ci.yml/badge.svg)](https://github.com/Aastik780/pulsee-panel/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/Aastik780/pulsee-panel)](LICENSE)
[![Next.js](https://img.shields.io/badge/next.js-15-black)](https://nextjs.org)

</div>

---

## Features

- **Status cards** — online/offline, uptime, servers, members, gateway latency, memory & CPU
- **Now Playing** — track, artist, requester and a live progress bar
- **Queue** — upcoming tracks with requester avatars and durations
- **Auto-refresh** — polls every 5 seconds, no page reloads
- **Live or demo mode** — point it at a real bot, or run standalone with sample data
- **Dark theme** — zero UI dependencies, plain CSS, fast build

## Quick start

```bash
git clone https://github.com/Aastik780/pulsee-panel.git
cd pulsee-panel
npm install
npm run dev
```

Open http://localhost:3000 — you'll see **DEMO DATA** with sample stats.

## Connect it to the real bot

```bash
cp .env.example .env.local
# set: PULSEE_BOT_API_URL=http://localhost:5100
npm run dev
```

The panel's `/api/status` route proxies `${PULSEE_BOT_API_URL}/api/status` (3s timeout) and flips the badge to **LIVE**. If the bot goes down, the badge switches to **BOT OFFLINE** instead of failing.

### Expected upstream shape

```jsonc
{
  "bot": { "online": true, "guilds": 12, "users": 486, "ping": 42, "uptimeSeconds": 8043 },
  "nowPlaying": {
    "title": "After Dark",
    "artist": "Mr.Kitty",
    "duration": 259,
    "position": 97,
    "requestedBy": { "username": "aastik" }
  },
  "queue": [{ "title": "...", "artist": "...", "duration": 200, "requestedBy": { "username": "..." } }],
  "system": { "cpuUsage": 17, "memoryUsage": { "heapUsed": 92, "heapTotal": 148, "rss": 186 }, "nodeVersion": "v22.14.0", "platform": "win32" }
}
```

Missing `nowPlaying`/`queue` fields are handled — the panel renders empty states.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run check` | TypeScript typecheck |

## Stack

Next.js (App Router) · React 19 · TypeScript · plain CSS · zero UI libraries

## License

[MIT](LICENSE) © Aastik Gupta
