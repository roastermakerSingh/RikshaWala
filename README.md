# Ricksha Wala

A Bhojpuri music player built with React + Vite. The home screen shows four
playlist categories as cards; tapping one opens its song list and player.
Playback uses the official **YouTube IFrame Player**, with songs resolved
through the official **YouTube Data API v3** search — no scraping, no DRM
circumvention, no unofficial APIs. Every video played is the real one
hosted on YouTube by the rights holder / official channel.

## Categories

1. **Pawan Singh Hits** — his best-known songs
2. **Khesari Lal Yadav Hits** — his best-known songs
3. **New 2025–2026 Hits** — recent/trending releases across artists
4. **Bhojpuri Orchestra (50)** — 50 live-band / orchestra / instrumental tracks

Song lists live in `src/data/categories.js` as plain title strings used only
as search queries — no audio or lyrics are stored in the repo.

## 1. Get a free YouTube Data API key

1. Go to the [YouTube Data API v3 page](https://console.cloud.google.com/apis/library/youtube.googleapis.com)
   in Google Cloud Console (create a project if you don't have one).
2. Click **Enable**.
3. Go to **APIs & Services → Credentials → Create Credentials → API key**.
4. Copy the key.

Free tier: 10,000 quota units/day, 100 units per search (~100 song lookups/day).
Every resolved song is cached in the browser (`localStorage`) so repeat plays
don't cost quota.

## 2. Run it locally

```bash
cp .env.example .env
# edit .env and paste your key:
# VITE_YOUTUBE_API_KEY=your_key_here

npm install
npm run dev
```

Open the printed localhost URL, pick a category card, then click a song.

## 3. Deploy to Netlify

This repo already has a `netlify.toml` (build command `npm run build`,
publish folder `dist`, plus an SPA redirect so page reloads work).

**Option A — Netlify UI (easiest):**
1. Push this project to a GitHub repo.
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
3. Build settings are auto-detected from `netlify.toml` — just click **Deploy**.
4. Go to **Site configuration → Environment variables** and add:
   - Key: `VITE_YOUTUBE_API_KEY`
   - Value: your API key
5. Trigger a redeploy (**Deploys → Trigger deploy → Deploy site**) so the
   env var gets baked into the build.

**Option B — Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_YOUTUBE_API_KEY your_key_here
netlify deploy --prod
```

Your key becomes part of the client-side JS bundle either way (it's a
`VITE_` var). That's normal for browser-side API keys — just restrict the
key in Google Cloud Console to your Netlify domain and to the YouTube Data
API only, under **Credentials → your key → Application restrictions /
API restrictions**, so it can't be reused elsewhere.

## Project structure

```
src/
  data/categories.js         4 categories, each a list of songs (titles → search queries)
  youtube/
    youtubeSearch.js          YouTube Data API v3 search + localStorage cache
    loadYouTubeAPI.js          loads the YouTube IFrame Player script once
  components/
    Icons.jsx                  shared SVG icons (wheel, rickshaw, play/pause, etc)
    Hero.jsx                    top banner with animated rickshaw (home screen only)
    CategoryGrid.jsx             4-card category picker
    SearchBar.jsx                 filter songs within a category
    Playlist.jsx                   scrollable track grid with loading/playing states
    PlayerBar.jsx                   fixed bottom player (progress, shuffle, repeat, volume)
    YouTubePlayer.jsx               hidden YouTube IFrame player, exposed via ref
  App.jsx                         category navigation, search resolution, playback wiring
  main.jsx                         React entry point
  index.css                        all styles
netlify.toml                      Netlify build + SPA redirect config
```

## Notes

- Without an API key set, the app shows a banner and playback won't start —
  it will not fall back to any unofficial source.
- Some searches may occasionally resolve to a fan upload, cover, or remix
  instead of the exact official track, since it's driven by YouTube's search
  ranking. Skip to the next song, or refine the query in `categories.js`.
