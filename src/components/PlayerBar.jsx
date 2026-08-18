import { useRef } from "react";
import {
  WheelIcon,
  MiniRickshaw,
  PlayIcon,
  PauseIcon,
  NextIcon,
  PrevIcon,
  ShuffleIcon,
  RepeatIcon,
  VolumeIcon,
} from "./Icons.jsx";

const COLORS = ["var(--green)", "var(--red)", "var(--yellow-dark)", "#7A5C1E", "#2E5F8A", "#8A3E5F"];

function fmt(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function PlayerBar({
  song,
  index,
  playing,
  loading,
  progress,
  duration,
  volume,
  shuffle,
  repeat,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleShuffle,
  onToggleRepeat,
}) {
  const roadRef = useRef(null);
  const pct = duration ? (progress / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = roadRef.current.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    onSeek(p);
  };

  return (
    <div className="player-bar">
      <div className="road" ref={roadRef} onClick={handleSeek}>
        <div className="road-track">
          <div className="road-fill" style={{ width: pct + "%" }}></div>
        </div>
        <div className="road-rickshaw" style={{ left: pct + "%" }}>
          <MiniRickshaw />
        </div>
      </div>
      <div className="player-controls">
        <div className="now-playing">
          <div className="track-thumb" style={{ background: COLORS[index % COLORS.length] }}>
            <WheelIcon size={16} />
          </div>
          <div>
            <div className="now-title">{song.title}</div>
            <div className="now-artist">{song.artist}</div>
          </div>
        </div>

        <span className="time-label">{fmt(progress)}</span>

        <div className="ctrl-btns">
          <button
            className={"ctrl-btn" + (shuffle ? " active-toggle" : "")}
            onClick={onToggleShuffle}
            aria-label="Toggle shuffle"
          >
            <ShuffleIcon />
          </button>
          <button className="ctrl-btn" onClick={onPrev} aria-label="Previous">
            <PrevIcon />
          </button>
          <button className="ctrl-btn play-btn" onClick={onTogglePlay} aria-label="Play or pause">
            {loading ? <span className="spinner spinner-dark" /> : playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="ctrl-btn" onClick={onNext} aria-label="Next">
            <NextIcon />
          </button>
          <button
            className={"ctrl-btn" + (repeat ? " active-toggle" : "")}
            onClick={onToggleRepeat}
            aria-label="Toggle repeat"
          >
            <RepeatIcon />
          </button>
        </div>

        <span className="time-label">{fmt(duration)}</span>

        <div className="vol-wrap">
          <VolumeIcon />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
