import { useRef } from "react";
import {
  WheelIcon,
  PlayIcon,
  PauseIcon,
  NextIcon,
  PrevIcon,
  ShuffleIcon,
  RepeatIcon,
} from "./Icons.jsx";

function fmt(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function PlayerBar({
  song,
  thumbnail,
  playing,
  loading,
  progress,
  duration,
  shuffle,
  repeat,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
}) {
  const trackRef = useRef(null);
  const pct = duration ? (progress / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(p);
  };

  return (
    <div className="player-pill">
      <div className={"player-pill-art" + (playing ? " spinning" : "")}>
        {thumbnail ? (
          <img src={thumbnail} alt="" />
        ) : (
          <div className="player-pill-art-fallback">
            <WheelIcon size={26} />
          </div>
        )}
      </div>

      <div className="player-pill-mid">
        <div className="player-pill-title">
          {song.title}
          {song.artist ? <span> · {song.artist}</span> : null}
        </div>
        <div className="player-pill-progress" ref={trackRef} onClick={handleSeek}>
          <div className="player-pill-progress-fill" style={{ width: pct + "%" }}></div>
          <div className="player-pill-progress-dot" style={{ left: pct + "%" }}></div>
        </div>
        <div className="player-pill-times mono">
          <span>{fmt(progress)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      <div className="player-pill-controls">
        <button
          className={"pill-icon-btn" + (shuffle ? " active-toggle" : "")}
          onClick={onToggleShuffle}
          aria-label="Toggle shuffle"
          title="Shuffle"
        >
          <ShuffleIcon />
        </button>
        <button className="pill-icon-btn" onClick={onPrev} aria-label="Previous">
          <PrevIcon />
        </button>
        <button className="pill-play-btn" onClick={onTogglePlay} aria-label="Play or pause">
          {loading ? <span className="spinner spinner-dark" /> : playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button className="pill-icon-btn" onClick={onNext} aria-label="Next">
          <NextIcon />
        </button>
        <button
          className={"pill-icon-btn" + (repeat ? " active-toggle" : "")}
          onClick={onToggleRepeat}
          aria-label="Toggle repeat"
          title="Repeat"
        >
          <RepeatIcon />
        </button>
      </div>
    </div>
  );
}
