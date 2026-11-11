import React from "react";

// Stateless component: the search text lives in the parent (lifting state up).
class SearchBar extends React.Component {
  render() {
    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by item name..."
          value={this.props.searchTerm}
          onChange={(event) => this.props.onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") this.props.onSearch();
          }}
        />
        <button type="button" className="btn btn-primary" onClick={() => this.props.onSearch()}>
          Search
        </button>
        {this.props.isSearching ? (
          <button type="button" className="btn btn-light" onClick={() => this.props.onClear()}>
            Clear
          </button>
        ) : null}
      </div>
    );
  }
}

export default SearchBar;
