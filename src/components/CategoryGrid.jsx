import { WheelIcon } from "./Icons.jsx";

export default function CategoryGrid({ categories, onSelect }) {
  return (
    <div className="category-grid">
      {categories.map((cat) => (
        <button key={cat.id} className="category-card" onClick={() => onSelect(cat)}>
          <div className="category-card-icon" style={{ background: cat.accent }}>
            <WheelIcon size={26} />
          </div>
          <div className="category-card-body">
            <h3>{cat.name}</h3>
            <p>{cat.tagline}</p>
            <span className="category-card-count mono">{cat.songs.length} songs</span>
          </div>
        </button>
      ))}
    </div>
  );
}
