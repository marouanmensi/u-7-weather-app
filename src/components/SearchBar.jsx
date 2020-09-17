import React from "react";
import SearchResults from "./SearchResults";

const SearchBar = ({
  value,
  onChange,
  results,
  resultsClass,
  onClick,
  onClose,
}) => {
  return (
    <React.Fragment>
      <form id="nav-search-bar">
        <input
          type="search"
          name="query"
          placeholder="Search"
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          onClick={onClick}
        />
      </form>
      <SearchResults
        searchResults={results}
        resultsClass={resultsClass}
        onClose={onClose}
      />
    </React.Fragment>
  );
};

export default SearchBar;
