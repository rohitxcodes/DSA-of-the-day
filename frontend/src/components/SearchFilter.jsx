export default function SearchFilter({ search, setSearch, filter, setFilter }) {
  return (
    <div className="search-filter">
      <input
        className="search-input"
        placeholder="Search questions..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div
        className="filter-group"
        role="tablist"
        aria-label="Question filters"
      >
        {[
          ["all", "All"],
          ["completed", "Completed"],
          ["pending", "Pending"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`filter-button ${filter === value ? "is-active" : ""}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
