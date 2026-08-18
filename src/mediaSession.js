// Wires up the browser Media Session API so the OS/browser shows native
// play/pause/next/prev controls on the lock screen (mobile), notification
// shade, and keyboard media keys (desktop) — and keeps audio going while
// the tab is backgrounded, phone is locked, or another app is in focus.
//
// IMPORTANT LIMIT: this cannot make playback continue after the browser is
// fully closed/quit — no website can do that, only installed native apps.
// It DOES let people control playback without switching back to the tab.

export function isMediaSessionSupported() {
  return typeof navigator !== "undefined" && "mediaSession" in navigator;
}

export function setMediaSessionMetadata({ title, artist, artwork }) {
  if (!isMediaSessionSupported()) return;
  try {
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: title || "Ricksha Wala",
      artist: artist || "Bhojpuri Beats",
      album: "Ricksha Wala",
      artwork: artwork
        ? [
            { src: artwork, sizes: "96x96", type: "image/jpeg" },
            { src: artwork, sizes: "192x192", type: "image/jpeg" },
            { src: artwork, sizes: "512x512", type: "image/jpeg" },
          ]
        : [],
    });
  } catch {
    // MediaMetadata not available in this browser
  }
}

export function setMediaSessionPlaybackState(playing) {
  if (!isMediaSessionSupported()) return;
  navigator.mediaSession.playbackState = playing ? "playing" : "paused";
}

export function registerMediaSessionHandlers({ onPlay, onPause, onNext, onPrev }) {
  if (!isMediaSessionSupported()) return;
  const actions = [
    ["play", onPlay],
    ["pause", onPause],
    ["previoustrack", onPrev],
    ["nexttrack", onNext],
  ];
  for (const [action, handler] of actions) {
    try {
      navigator.mediaSession.setActionHandler(action, handler || null);
    } catch {
      // action not supported in this browser, ignore
    }
  }
}
