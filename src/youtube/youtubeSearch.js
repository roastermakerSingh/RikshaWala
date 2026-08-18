// Resolves a song title to a YouTube videoId using the official YouTube Data API v3.
// Requires a free API key from Google Cloud Console (YouTube Data API v3 enabled).
// See README.md for setup instructions.
//
// Results are cached in localStorage so repeat lookups don't burn API quota
// (the free tier gives 10,000 units/day; each search costs 100 units).

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const CACHE_KEY = "rickshawala_yt_cache_v1";

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore quota errors
  }
}

export class YouTubeSearchError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

/**
 * Look up the best-matching official/video result for a song.
 * @param {string} query - search text, e.g. "Pawan Singh Lollypop Lagelu Bhojpuri song"
 * @param {string} cacheKey - stable key to cache under, e.g. song id
 * @returns {Promise<{videoId: string, title: string, channelTitle: string, thumbnail: string}>}
 */
export async function resolveVideoId(query, cacheKey) {
  const cache = readCache();
  if (cache[cacheKey]) return cache[cacheKey];

  if (!API_KEY) {
    throw new YouTubeSearchError(
      "Missing YouTube API key. Add VITE_YOUTUBE_API_KEY to your .env file.",
      "no_api_key"
    );
  }

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("videoCategoryId", "10"); // Music
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const reason = body?.error?.errors?.[0]?.reason || res.status;
    throw new YouTubeSearchError(`YouTube search failed (${reason})`, "api_error");
  }

  const data = await res.json();
  const item = data.items && data.items[0];
  if (!item) {
    throw new YouTubeSearchError("No video found for this song.", "no_results");
  }

  const result = {
    videoId: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
  };

  cache[cacheKey] = result;
  writeCache(cache);
  return result;
}
