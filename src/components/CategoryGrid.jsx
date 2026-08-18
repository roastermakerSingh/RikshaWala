import { useRef } from "react";
import { WheelIcon } from "./Icons.jsx";

function TiltCard({ cat, onSelect, isPlaying }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -6;
    const rotateY = ((x - rect.width / 2) / rect.width) * 6;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (card) card.style.transform = "";
  };

  return (
    <button
      ref={cardRef}
      className={"category-card" + (isPlaying ? " is-playing" : "")}
      style={{ "--cat-accent": cat.accent }}
      onClick={() => onSelect(cat)}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >
      {isPlaying && <span className="category-playing-badge mono">▶ Playing</span>}
      <div className="category-card-icon" style={{ background: cat.accent }}>
        <WheelIcon size={26} />
      </div>
      <div className="category-card-body">
        <h3>{cat.name}</h3>
        <p>{cat.tagline}</p>
        <span className="category-card-count mono">{cat.songs.length} songs</span>
      </div>
      <span className="category-card-arrow mono">Chalo →</span>
    </button>
  );
}

export default function CategoryGrid({ categories, onSelect, playingCategoryId }) {
  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <TiltCard key={cat.id} cat={cat} onSelect={onSelect} isPlaying={cat.id === playingCategoryId} />
      ))}
    </div>
  );
}
