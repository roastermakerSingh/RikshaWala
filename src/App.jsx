import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { CATEGORIES } from "./data/categories.js";
import { resolveVideoId, YouTubeSearchError } from "./youtube/youtubeSearch.js";
import {
  setMediaSessionMetadata,
  setMediaSessionPlaybackState,
  registerMediaSessionHandlers,
} from "./mediaSession.js";
import { WheelIcon } from "./components/Icons.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import Hero from "./components/Hero.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Playlist from "./components/Playlist.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import YouTubePlayer from "./components/YouTubePlayer.jsx";
import CategoryGrid from "./components/CategoryGrid.jsx";
import InstallPrompt from "./components/InstallPrompt.jsx";

const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };

// NOTE ON STATE SHAPE:
// `viewCategoryId` is which category the person is currently BROWSING
// (what's shown on screen). `playingCategoryId` is which category's queue is
// actually LOADED into the player. These are deliberately separate — going
// "back" to the category grid only changes what you're looking at; it must
// never touch playback, so a song keeps running (like YouTube's mini-player)
// while you browse elsewhere.

export default function App() {
  const [viewCategoryId, setViewCategoryId] = useState(null); // null = home/browsing all categories
  const [playingCategoryId, setPlayingCategoryId] = useState(null); // which queue is loaded
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [query, setQuery] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | resolving | ready | error
  const [errorMessage, setErrorMessage] = useState("");
  const [playerReady, setPlayerReady] = useState(false);
  const [nowPlayingMeta, setNowPlayingMeta] = useState(null); // { title, channelTitle, thumbnail }
  const [scrolled, setScrolled] = useState(false);

  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const wantPlayRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const viewCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === viewCategoryId) || null,
    [viewCategoryId]
  );

  const playingCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === playingCategoryId) || null,
    [playingCategoryId]
  );

  // The queue actually loaded in the player — independent of what's on screen.
  const queue = playingCategory ? playingCategory.songs : [];
  const currentSong = queue[currentIndex];

  // The list shown on screen — always follows whatever category you're viewing.
  const viewSongs = viewCategory ? viewCategory.songs : [];
  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return viewSongs;
    return viewSongs.filter((s) => s.title.toLowerCase().includes(q));
  }, [viewSongs, query]);

  const loadCurrentSong = useCallback(
    async (autoplay) => {
      if (!playerRef.current || !playerReady || !currentSong) return;
      setStatus("resolving");
      setErrorMessage("");
      wantPlayRef.current = autoplay;
      try {
        const result = await resolveVideoId(currentSong.query, currentSong.id);
        playerRef.current.loadVideo(result.videoId, autoplay);
        setNowPlayingMeta({
          title: currentSong.title,
          channelTitle: currentSong.artist || result.channelTitle,
          thumbnail: result.thumbnail,
        });
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setErrorMessage(
          err instanceof YouTubeSearchError
            ? err.message
            : "Couldn't load this song. Check your connection and try again."
        );
        setPlaying(false);
      }
    },
    [currentSong, playerReady]
  );

  useEffect(() => {
    if (playerReady && currentSong) loadCurrentSong(wantPlayRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, playerReady, playingCategoryId]);

  useEffect(() => {
    if (playerRef.current) playerRef.current.setVolume(volume);
  }, [volume]);

  // Keep the OS lock-screen / notification / hardware-key controls in sync
  useEffect(() => {
    if (nowPlayingMeta) {
      setMediaSessionMetadata({
        title: nowPlayingMeta.title,
        artist: nowPlayingMeta.channelTitle,
        artwork: nowPlayingMeta.thumbnail,
      });
    }
  }, [nowPlayingMeta]);

  useEffect(() => {
    setMediaSessionPlaybackState(playing);
  }, [playing]);

  const goNext = useCallback(() => {
    setCurrentIndex((c) => {
      if (queue.length === 0) return c;
      if (shuffle && queue.length > 1) {
        let next = Math.floor(Math.random() * queue.length);
        if (next === c) next = (next + 1) % queue.length;
        return next;
      }
      return (c + 1) % queue.length;
    });
  }, [shuffle, queue.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((c) => (queue.length ? (c - 1 + queue.length) % queue.length : c));
  }, [queue.length]);

  useEffect(() => {
    registerMediaSessionHandlers({
      onPlay: () => playerRef.current && playerRef.current.play(),
      onPause: () => playerRef.current && playerRef.current.pause(),
      onNext: () => {
        wantPlayRef.current = true;
        goNext();
      },
      onPrev: () => {
        wantPlayRef.current = true;
        goPrev();
      },
    });
  }, [goNext, goPrev]);

  useEffect(() => {
    if (playing) {
      pollRef.current = setInterval(() => {
        if (playerRef.current) {
          setProgress(playerRef.current.getCurrentTime() || 0);
          setDuration(playerRef.current.getDuration() || 0);
        }
      }, 500);
    } else if (pollRef.current) {
      clearInterval(pollRef.current);
    }
    return () => pollRef.current && clearInterval(pollRef.current);
  }, [playing]);

  const handlePlayerStateChange = (state) => {
    if (state === YT_STATE.PLAYING) setPlaying(true);
    else if (state === YT_STATE.PAUSED) setPlaying(false);
    else if (state === YT_STATE.ENDED) {
      if (repeat) {
        playerRef.current.seekTo(0);
        playerRef.current.play();
      } else {
        wantPlayRef.current = true;
        goNext();
      }
    }
  };

  const togglePlay = () => {
    if (status === "error") {
      loadCurrentSong(true);
      return;
    }
    if (!playerRef.current) return;
    if (playing) playerRef.current.pause();
    else playerRef.current.play();
  };

  // Selecting a song always starts/replaces the PLAYING queue with whatever
  // category the song came from — separate from which category you're viewing.
  const selectSong = (song) => {
    if (!viewCategory) return;
    const idx = viewCategory.songs.findIndex((s) => s.id === song.id);
    wantPlayRef.current = true;
    setPlayingCategoryId(viewCategory.id);
    setCurrentIndex(idx);
  };

  const handleSeek = (pct) => {
    if (playerRef.current && duration) {
      const t = pct * duration;
      playerRef.current.seekTo(t);
      setProgress(t);
    }
  };

  // Just changes what's on screen — playback is untouched.
  const openCategory = (cat) => {
    setViewCategoryId(cat.id);
    setQuery("");
  };

  // Just changes what's on screen — playback keeps running, like a
  // minimized/background player, exactly like navigating within the YouTube app.
  const goHome = () => {
    setViewCategoryId(null);
    setQuery("");
  };

  const isViewingPlayingCategory = viewCategoryId === playingCategoryId && playingCategoryId !== null;

  return (
    <>
      <YouTubePlayer
        ref={playerRef}
        onReady={() => setPlayerReady(true)}
        onStateChange={handlePlayerStateChange}
        onError={() => {
          setStatus("error");
          setErrorMessage("YouTube couldn't play this video. Try the next song.");
          setPlaying(false);
        }}
      />

      <nav
        className={
          "nav" +
          (scrolled ? " scrolled" : "") +
          (!viewCategory && !scrolled ? " nav-overlay" : "")
        }
      >
        <button className="brand" onClick={goHome} aria-label="Go to home">
          <WheelIcon size={26} />
          <span className="brand-name">RICKSHA WALA</span>
        </button>
        <div className="nav-pills">
          <a
            className="nav-pill mono"
            href="https://www.youtube.com/watch?v=LChlPaLTs0s&list=RDLChlPaLTs0s"
            target="_blank"
            rel="noopener noreferrer"
          >
            ♪ YouTube Mix ↗
          </a>
          <a
            className="nav-pill mono"
            href="https://www.linkedin.com/in/sonu-profile-url"
            target="_blank"
            rel="noopener noreferrer"
          >
            Creator ↗
          </a>
          <ThemeToggle />
        </div>
        <div className="pinstripe nav-pinstripe"></div>
      </nav>

      <div className="page-content">
        <InstallPrompt />

        {currentSong && playing && (
          <div className="now-playing-ribbon">
            <div className="now-playing-ribbon-track">
              <span>♪ Now playing: {currentSong.title} — {currentSong.artist || "Bhojpuri"} ♪</span>
              <span>♪ Now playing: {currentSong.title} — {currentSong.artist || "Bhojpuri"} ♪</span>
            </div>
          </div>
        )}

        <div key={viewCategory ? viewCategory.id : "home"} className="view-transition">
        {!viewCategory && (
          <>
            <Hero />
          <div className="section-label">
            <h2>Choose your playlist</h2>
            <span className="count mono">{CATEGORIES.length} categories</span>
          </div>
          <CategoryGrid categories={CATEGORIES} onSelect={openCategory} playingCategoryId={playingCategoryId} />
        </>
      )}

      {viewCategory && (
        <>
          <div className="category-header">
            <button className="back-btn" onClick={goHome}>
              &larr; All categories
            </button>
            <h2>{viewCategory.name}</h2>
            <p className="category-header-tagline">{viewCategory.tagline}</p>
          </div>

          <SearchBar value={query} onChange={setQuery} />

          <div className="section-label">
            <h2>{viewCategory.name}</h2>
            <span className="count mono">{filteredSongs.length} tracks</span>
          </div>

          {status === "error" && isViewingPlayingCategory && (
            <div className="status-banner status-error">{errorMessage}</div>
          )}
          {!import.meta.env.VITE_YOUTUBE_API_KEY && (
            <div className="status-banner status-warning">
              Add a YouTube Data API key to your .env file to enable playback — see README.md.
            </div>
          )}

          <Playlist
            songs={filteredSongs}
            currentId={isViewingPlayingCategory && currentSong ? currentSong.id : null}
            playing={playing}
            loading={isViewingPlayingCategory && status === "resolving"}
            duration={duration}
            onSelect={selectSong}
          />
        </>
      )}
      </div>
      </div>

      {currentSong && (
        <PlayerBar
          song={currentSong}
          thumbnail={nowPlayingMeta && nowPlayingMeta.thumbnail}
          playing={playing}
          loading={status === "resolving"}
          progress={progress}
          duration={duration}
          shuffle={shuffle}
          repeat={repeat}
          onTogglePlay={togglePlay}
          onNext={goNext}
          onPrev={goPrev}
          onSeek={handleSeek}
          onToggleShuffle={() => setShuffle((s) => !s)}
          onToggleRepeat={() => setRepeat((r) => !r)}
        />
      )}
    </>
  );
}
