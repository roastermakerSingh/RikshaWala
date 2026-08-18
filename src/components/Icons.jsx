export function WheelIcon({ size = 18 }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <g className="wheel">
        <circle cx="20" cy="20" r="16" fill="none" stroke="#2a2a26" strokeWidth="4" />
        <line x1="20" y1="6" x2="20" y2="34" stroke="#2a2a26" strokeWidth="2" />
        <line x1="6" y1="20" x2="34" y2="20" stroke="#2a2a26" strokeWidth="2" />
        <line x1="9.5" y1="9.5" x2="30.5" y2="30.5" stroke="#2a2a26" strokeWidth="2" />
        <line x1="9.5" y1="30.5" x2="30.5" y2="9.5" stroke="#2a2a26" strokeWidth="2" />
        <circle cx="20" cy="20" r="3" fill="#2a2a26" />
      </g>
    </svg>
  );
}

export function RickshawSVG({ playing }) {
  return (
    <svg viewBox="0 0 220 150" width="100%" height="100%">
      <ellipse cx="110" cy="130" rx="95" ry="8" fill="#e7d59a" opacity="0.6" />
      <path d="M40 60 Q40 30 95 30 L120 30 Q145 30 150 60 Z" fill="var(--green)" />
      <rect x="35" y="58" width="120" height="42" rx="10" fill="var(--yellow)" />
      <rect x="150" y="70" width="30" height="26" rx="6" fill="var(--yellow)" />
      <rect x="42" y="66" width="34" height="24" rx="4" fill="#2a2a26" opacity="0.85" />
      <rect x="90" y="66" width="34" height="24" rx="4" fill="#2a2a26" opacity="0.85" />
      <circle cx="185" cy="96" r="4" fill="var(--red)" />
      <g transform="translate(60,100)">
        <g
          className={playing ? "wheel" : ""}
          style={{ transformOrigin: "22px 22px", animationPlayState: playing ? "running" : "paused" }}
        >
          <circle cx="22" cy="22" r="20" fill="#1B1B1B" />
          <circle cx="22" cy="22" r="20" fill="none" stroke="var(--chrome)" strokeWidth="3" />
          <circle cx="22" cy="22" r="5" fill="var(--chrome)" />
          <line x1="22" y1="4" x2="22" y2="40" stroke="var(--chrome)" strokeWidth="2" />
          <line x1="4" y1="22" x2="40" y2="22" stroke="var(--chrome)" strokeWidth="2" />
        </g>
      </g>
      <g transform="translate(130,100)">
        <g
          className={playing ? "wheel" : ""}
          style={{ transformOrigin: "22px 22px", animationPlayState: playing ? "running" : "paused" }}
        >
          <circle cx="22" cy="22" r="20" fill="#1B1B1B" />
          <circle cx="22" cy="22" r="20" fill="none" stroke="var(--chrome)" strokeWidth="3" />
          <circle cx="22" cy="22" r="5" fill="var(--chrome)" />
          <line x1="22" y1="4" x2="22" y2="40" stroke="var(--chrome)" strokeWidth="2" />
          <line x1="4" y1="22" x2="40" y2="22" stroke="var(--chrome)" strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}

export function MiniRickshaw() {
  return (
    <svg viewBox="0 0 40 30" width="34" height="24">
      <path d="M6 12 Q6 4 18 4 L24 4 Q30 4 31 12 Z" fill="var(--green)" />
      <rect y="12" width="34" height="9" rx="3" fill="var(--yellow)" />
      <circle cx="10" cy="24" r="5" fill="#1B1B1B" />
      <circle cx="26" cy="24" r="5" fill="#1B1B1B" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
export function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
export function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5l10 7-10 7V5zM18 5h2v14h-2z" />
    </svg>
  );
}
export function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 5L8 12l10 7V5zM4 5h2v14H4z" />
    </svg>
  );
}
export function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h4l10 16h2M4 20h4l3.5-5.5M17 4h3v3M14 7l6-3M17 20h3v-3M14 17l6 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function RepeatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 2l4 4-4 4M3 11V9a4 4 0 014-4h14M7 22l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
export function VolumeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#a3a396">
      <path d="M3 10v4h4l5 5V5L7 10H3z" />
    </svg>
  );
}
