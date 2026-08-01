const filters = ["All", "Completed", "Pending"];

function SearchFilter({ filter, onFilterChange, onSearchChange, search }) {
  return (
    <div className="search-filter">
      <input
        className="text-input text-input--search"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search questions..."
        value={search}
      />

      <div className="filter-tabs" role="tablist" aria-label="Question filters">
        {filters.map((filterName) => (
          <button
            key={filterName}
            className={
              filterName === filter
                ? "filter-tab filter-tab--active"
                : "filter-tab"
            }
            type="button"
            onClick={() => onFilterChange(filterName)}
          >
            {filterName}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchFilter;
