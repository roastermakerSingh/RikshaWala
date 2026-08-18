import { WheelIcon } from "./Icons.jsx";

const COLORS = ["var(--green)", "var(--red)", "var(--yellow-dark)", "#7A5C1E", "#2E5F8A", "#8A3E5F"];

function fmt(s) {
  if (!s || isNaN(s)) return "—";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function Playlist({ songs, currentId, playing, loading, duration, onSelect }) {
  if (songs.length === 0) {
    return <div className="empty-state">No songs match your search. Try a different title.</div>;
  }

  return (
    <div className="playlist">
      {songs.map((song, i) => {
        const isActive = song.id === currentId;
        return (
          <div
            key={song.id}
            className={"track-card" + (isActive ? " active" : "")}
            onClick={() => onSelect(song)}
          >
            <span className="track-num mono">{String(song.id).padStart(2, "0")}</span>
            <div className="track-thumb" style={{ background: COLORS[i % COLORS.length] }}>
              <WheelIcon size={20} />
            </div>
            <div className="track-info">
              <div className="track-title">{song.title}</div>
              <div className="track-artist">{song.artist}</div>
            </div>
            {isActive && loading ? (
              <span className="spinner" aria-label="Loading" />
            ) : isActive && playing ? (
              <div className="track-playing-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <span className="track-dur mono">{isActive ? fmt(duration) : ""}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
