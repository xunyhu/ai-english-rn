# AI English

AI-powered English learning app for developers. Built with Expo and React Native.

## Features

- **Home** — Daily English sentence (OpenAI), study progress, quick navigation
- **AI Chat** — Streaming tutor with translation, grammar, and vocabulary
- **Shadowing** — AI sentences, recording, Whisper transcription, pronunciation feedback
- **Interview** — Technical interview practice with structured feedback
- **Profile** — Account placeholder (settings coming soon)

## Tech stack

- [Expo SDK 56](https://docs.expo.dev/) + React Native
- TypeScript (strict)
- [expo-router](https://docs.expo.dev/router/introduction/) — file-based routing
- [NativeWind](https://www.nativewind.dev/) — Tailwind for RN
- [Zustand](https://zustand.docs.pmnd.rs/) — client state (persisted progress & profile)
- [TanStack Query](https://tanstack.com/query) — async data & caching
- [OpenAI API](https://platform.openai.com/) — chat, TTS, Whisper, content generation

## Requirements

- Node.js 18+
- npm 9+
- [Expo Go](https://expo.dev/go) or iOS Simulator / Android Emulator
- OpenAI API key with access to chat, speech, and transcription endpoints

## Setup

1. **Clone and install**

   ```bash
   git clone <repository-url>
   cd ai-english-rn
   npm install
   ```

2. **Environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set your OpenAI key:

   ```env
   EXPO_PUBLIC_OPENAI_API_KEY=sk-...
   EXPO_PUBLIC_APP_ENV=development
   ```

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `EXPO_PUBLIC_OPENAI_API_KEY` | Yes | OpenAI API key |
   | `EXPO_PUBLIC_OPENAI_MODEL` | No | Chat model (default: `gpt-4o-mini`) |
   | `EXPO_PUBLIC_OPENAI_WHISPER_MODEL` | No | Transcription model (default: `whisper-1`) |
   | `EXPO_PUBLIC_APP_ENV` | No | `development` \| `production` \| `preview` |

   Expo loads `EXPO_PUBLIC_*` variables at build time. Restart the dev server after changing `.env`.

3. **Start the app**

   ```bash
   npm start
   ```

   Press `i` (iOS), `a` (Android), or scan the QR code with Expo Go.

   Clear Metro cache after env changes:

   ```bash
   npx expo start -c
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run ios` | Open iOS simulator |
| `npm run android` | Open Android emulator |
| `npm run web` | Run in browser |
| `npm run typecheck` | TypeScript check |

## Project structure

```
ai-english-rn/
├── app/                    # expo-router routes
│   ├── _layout.tsx         # root layout, error boundary, providers
│   └── (tabs)/             # tab screens
├── src/
│   ├── config/             # environment configuration
│   ├── components/         # shared UI + error boundary
│   ├── features/           # feature modules (ai-chat, shadowing, …)
│   ├── hooks/              # shared hooks
│   ├── lib/                # errors, logging
│   ├── providers/          # React Query provider
│   ├── services/           # OpenAI, TTS, daily English, shadowing
│   ├── store/              # Zustand stores
│   └── types/
├── .env.example
└── global.css
```

## Production notes

- Set `EXPO_PUBLIC_APP_ENV=production` for release builds.
- The OpenAI API key is embedded in the client bundle (`EXPO_PUBLIC_*`). For a public app store release, proxy requests through your own backend to keep keys secret.
- Study progress and continue-learning state are stored locally on device (AsyncStorage).
- Daily English is cached per calendar day to limit API usage.

## Permissions

- **Microphone** — shadowing recording (configured in `app.json`)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Missing EXPO_PUBLIC_OPENAI_API_KEY" | Create `.env` from `.env.example` and restart with `npx expo start -c` |
| AI features fail immediately | Verify API key, billing, and model access on OpenAI |
| Shadowing evaluation fails | Grant microphone permission; ensure recording completes before submit |
| Stale env values | Stop Metro and run `npx expo start -c` |

## License

Private — see repository owner.
