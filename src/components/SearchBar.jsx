import { SearchIcon } from "./Icons.jsx";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <div className="search-box">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search Pawan Singh songs..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
