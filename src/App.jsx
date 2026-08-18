import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { CATEGORIES } from "./data/categories.js";
import { resolveVideoId, YouTubeSearchError } from "./youtube/youtubeSearch.js";
import { WheelIcon } from "./components/Icons.jsx";
import Hero from "./components/Hero.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Playlist from "./components/Playlist.jsx";
import PlayerBar from "./components/PlayerBar.jsx";
import YouTubePlayer from "./components/YouTubePlayer.jsx";
import CategoryGrid from "./components/CategoryGrid.jsx";

const YT_STATE = { ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 };

export default function App() {
  const [categoryId, setCategoryId] = useState(null); // null = home
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

  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const wantPlayRef = useRef(false);

  const activeCategory = useMemo(
    () => CATEGORIES.find((c) => c.id === categoryId) || null,
    [categoryId]
  );

  const songs = activeCategory ? activeCategory.songs : [];

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return songs;
    return songs.filter((s) => s.title.toLowerCase().includes(q));
  }, [songs, query]);

  const currentSong = songs[currentIndex];

  const loadCurrentSong = useCallback(
    async (autoplay) => {
      if (!playerRef.current || !playerReady || !currentSong) return;
      setStatus("resolving");
      setErrorMessage("");
      wantPlayRef.current = autoplay;
      try {
        const result = await resolveVideoId(currentSong.query, currentSong.id);
        playerRef.current.loadVideo(result.videoId, autoplay);
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
  }, [currentIndex, playerReady, categoryId]);

  useEffect(() => {
    if (playerRef.current) playerRef.current.setVolume(volume);
  }, [volume]);

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

  const goNext = useCallback(() => {
    setCurrentIndex((c) => {
      if (songs.length === 0) return c;
      if (shuffle && songs.length > 1) {
        let next = Math.floor(Math.random() * songs.length);
        if (next === c) next = (next + 1) % songs.length;
        return next;
      }
      return (c + 1) % songs.length;
    });
  }, [shuffle, songs.length]);

  const goPrev = () => {
    setCurrentIndex((c) => (songs.length ? (c - 1 + songs.length) % songs.length : c));
  };

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

  const selectSong = (song) => {
    const idx = songs.findIndex((s) => s.id === song.id);
    wantPlayRef.current = true;
    setCurrentIndex(idx);
  };

  const handleSeek = (pct) => {
    if (playerRef.current && duration) {
      const t = pct * duration;
      playerRef.current.seekTo(t);
      setProgress(t);
    }
  };

  const openCategory = (cat) => {
    setCategoryId(cat.id);
    setCurrentIndex(0);
    setQuery("");
    wantPlayRef.current = false;
    setPlaying(false);
    setStatus("idle");
  };

  const goHome = () => {
    if (playerRef.current) playerRef.current.pause();
    setPlaying(false);
    setCategoryId(null);
    setQuery("");
  };

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

      <nav className="nav">
        <button className="brand" onClick={goHome} aria-label="Go to home">
          <WheelIcon size={26} />
          <span className="brand-name">RICKSHA WALA</span>
        </button>
        <span className="nav-pill mono">FULL JOSH</span>
      </nav>

      {!activeCategory && (
        <>
          <Hero playing={false} />
          <div className="section-label">
            <h2>Choose your playlist</h2>
            <span className="count mono">{CATEGORIES.length} categories</span>
          </div>
          <CategoryGrid categories={CATEGORIES} onSelect={openCategory} />
        </>
      )}

      {activeCategory && (
        <>
          <div className="category-header">
            <button className="back-btn" onClick={goHome}>
              &larr; All categories
            </button>
            <h2>{activeCategory.name}</h2>
            <p className="category-header-tagline">{activeCategory.tagline}</p>
          </div>

          <SearchBar value={query} onChange={setQuery} />

          <div className="section-label">
            <h2>{activeCategory.name}</h2>
            <span className="count mono">{filteredSongs.length} tracks</span>
          </div>

          {status === "error" && (
            <div className="status-banner status-error">{errorMessage}</div>
          )}
          {!import.meta.env.VITE_YOUTUBE_API_KEY && (
            <div className="status-banner status-warning">
              Add a YouTube Data API key to your .env file to enable playback — see README.md.
            </div>
          )}

          <Playlist
            songs={filteredSongs}
            currentId={currentSong && currentSong.id}
            playing={playing}
            loading={status === "resolving"}
            duration={duration}
            onSelect={selectSong}
          />
        </>
      )}

      {activeCategory && currentSong && (
        <PlayerBar
          song={currentSong}
          index={currentIndex}
          playing={playing}
          loading={status === "resolving"}
          progress={progress}
          duration={duration}
          volume={volume}
          shuffle={shuffle}
          repeat={repeat}
          onTogglePlay={togglePlay}
          onNext={goNext}
          onPrev={goPrev}
          onSeek={handleSeek}
          onVolumeChange={setVolume}
          onToggleShuffle={() => setShuffle((s) => !s)}
          onToggleRepeat={() => setRepeat((r) => !r)}
        />
      )}
    </>
  );
}
