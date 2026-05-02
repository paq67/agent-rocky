# Rocky Agent

Windows desktop AI companion — port of [agentrocky](https://github.com/itmesneha/agentrocky) using OpenCode Zen.

A pixel-art character lives on your Windows desktop. Rocky walks back and forth across the bottom of your screen above the taskbar. Click the sprite to open a model picker, pick a brain, then chat in a retro terminal window. When AI replies, Rocky jazz-dances. When rate limited, Rocky shows an exhaustion message with a HH:MM countdown.

## Quick Start

```bash
cp .env.example .env
# Fill in your OPENCODE_API_KEY (required) and GROQ_API_KEY (optional)
npm install
npm start
```

## API Keys

### OpenCode Zen (Required)
1. Go to [opencode.ai/auth](https://opencode.ai/auth)
2. Sign up and add billing (free models = $0)
3. Create your API key
4. Add to .env: `OPENCODE_API_KEY=sk_...`

### Groq (Optional)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free, no credit card)
3. Create your API key
4. Add to .env: `GROQ_API_KEY=gsk_...`

## Available Models

| Model | Provider | Free |
|-------|----------|------|
| Big Pickle | Zen | Yes |
| MiniMax M2.5 Free | Zen | Yes |
| Llama 3.3 70B | Groq | Yes |

## Features

- **Animated sprite** — Rocky walks across the bottom of your screen at 60fps with 8fps sprite animation
- **Drag & drop** — Click and drag Rocky to reposition him anywhere on screen
- **Pause/resume** — Double-tap Rocky to pause or resume walking
- **Jazz celebrations** — Rocky dances when AI completes a response
- **Speech bubbles** — Status messages while thinking, done, or idle
- **Retro terminal chat** — Click Rocky to open 420×520 dark terminal window
- **Rate limiting** — When exhausted, shows "rocky exhausted 😴 check back in HH:MM I miss thanu"
- **Switch models** — Click [switch model →] or click Rocky to pick a different brain

## Controls

- **Single click Rocky** — Opens model picker
- **Double click Rocky** — Toggle pause
- **Drag Rocky** — Reposition on screen
- **Click chat input when exhausted** — Shows "I miss thanu"
- **ESC or click outside picker** — Closes model picker

## Adding Sprites

Put your own PNG files in the project folder (not sprites/):

- `walkleft1.png`, `walkleft2.png` — walking frames (64×64)
- `jazz1.png`, `jazz2.png`, `jazz3.png` — celebration frames
- `stand.png` — standing still

The app falls back to emoji if PNGs are missing.

## Architecture

- `main.js` — Electron main process, 3 windows, IPC handlers
- `preload.js` — Context bridge for renderer
- `chat.js` — API calls to Zen/Groq
- `config.js` — Model configs and system prompt
- `tray.js` — System tray icon and menu
- `index.html` — Rocky sprite window
- `chat.html` — Terminal chat UI
- `model-picker.html` — Model selection

## Building

```bash
npm run build
```

This creates an executable in `dist/` folder.

## Troubleshooting

Black box around Rocky?
→ Enable hardware acceleration in Windows display settings
→ Update your GPU drivers
→ Right-click desktop → Display settings → Graphics → change to High performance GPU