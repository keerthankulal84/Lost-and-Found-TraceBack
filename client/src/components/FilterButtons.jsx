import React from "react";

// Stateless component: tells the parent which filter was clicked.
class FilterButtons extends React.Component {
  render() {
    const filters = [
      { value: "ALL", label: "All Items" },
      { value: "LOST", label: "Lost Items" },
      { value: "FOUND", label: "Found Items" }
    ];

    return (
      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={this.props.selectedFilter === filter.value ? "filter-btn active" : "filter-btn"}
            onClick={() => this.props.onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    );
  }
}

export default FilterButtons;
