import React from "react";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ItemForm from "./components/ItemForm.jsx";
import ItemList from "./components/ItemList.jsx";
import SearchBar from "./components/SearchBar.jsx";
import FilterButtons from "./components/FilterButtons.jsx";
import MatchResults from "./components/MatchResults.jsx";
import Footer from "./components/Footer.jsx";
import {
  fetchAllItems,
  searchItems,
  reportLostItem,
  reportFoundItem,
  deleteItem,
  fetchPossibleMatches
} from "./services/graphql.js";

// Stateful parent component. All shared data lives here (lifting state up).
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      error: "",
      successMessage: "",
      searchTerm: "",
      searchResults: null, // null means "no search is active"
      selectedFilter: "ALL",
      matchingResults: [],
      matchesLoading: false,
      matchesChecked: false,
      activeSection: "dashboard"
    };

    this.successTimer = null;

    this.loadItems = this.loadItems.bind(this);
    this.handleReport = this.handleReport.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClearSearch = this.handleClearSearch.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFindMatches = this.handleFindMatches.bind(this);
    this.handleNavigate = this.handleNavigate.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  // Runs once after the first render: get the initial data from the server.
  componentDidMount() {
    this.loadItems();
  }

  componentWillUnmount() {
    clearTimeout(this.successTimer);
  }

  async loadItems() {
    this.setState({ loading: true, error: "" });
    try {
      const items = await fetchAllItems();
      this.setState({ items: items, loading: false });
    } catch (error) {
      this.setState({ loading: false, error: error.message });
    }
  }

  showSuccess(message) {
    clearTimeout(this.successTimer);
    this.setState({ successMessage: message });
    this.successTimer = setTimeout(() => {
      this.setState({ successMessage: "" });
    }, 3000);
  }

  dismissError() {
    this.setState({ error: "" });
  }

  // Called by ItemForm (child to parent). Returns true if the report was saved.
  async handleReport(formType, itemData) {
    try {
      const newItem =
        formType === "LOST" ? await reportLostItem(itemData) : await reportFoundItem(itemData);

      // Create a new array instead of changing the old one.
      this.setState({
        items: [newItem, ...this.state.items],
        error: "",
        searchTerm: "",
        searchResults: null,
        matchingResults: [],
        matchesChecked: false
      });
      this.showSuccess(
        (formType === "LOST" ? "Lost" : "Found") + ' report "' + newItem.name + '" saved successfully.'
      );
      return true;
    } catch (error) {
      this.setState({ error: error.message });
      return false;
    }
  }

  // Called by ItemCard through ItemList.
  async handleDelete(id) {
    try {
      await deleteItem(id);

      this.setState({
        items: this.state.items.filter((item) => item.id !== id),
        searchResults:
          this.state.searchResults === null
            ? null
            : this.state.searchResults.filter((item) => item.id !== id),
        matchingResults: this.state.matchingResults.filter(
          (result) => result.lostItem.id !== id && result.foundItem.id !== id
        ),
        error: ""
      });
      this.showSuccess("Item deleted successfully.");
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  handleSearchChange(value) {
    this.setState({ searchTerm: value });
  }

  async handleSearch() {
    const term = this.state.searchTerm.trim();

    if (term === "") {
      this.setState({ searchResults: null });
      return;
    }

    try {
      const results = await searchItems(term);
      this.setState({ searchResults: results, error: "" });
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  handleClearSearch() {
    this.setState({ searchTerm: "", searchResults: null });
  }

  handleFilterChange(filter) {
    this.setState({ selectedFilter: filter });
  }

  // For every lost report, ask the server for its possible found reports.
  async handleFindMatches() {
    this.setState({ matchesLoading: true, error: "" });

    try {
      const lostItems = this.state.items.filter((item) => item.status === "LOST");
      const matchLists = await Promise.all(lostItems.map((item) => fetchPossibleMatches(item.id)));

      const results = [];
      lostItems.forEach((lostItem, index) => {
        matchLists[index].forEach((foundItem) => {
          results.push({ lostItem: lostItem, foundItem: foundItem, score: foundItem.matchScore });
        });
      });
      results.sort((a, b) => b.score - a.score);

      this.setState({ matchingResults: results, matchesLoading: false, matchesChecked: true });
    } catch (error) {
      this.setState({ matchesLoading: false, error: error.message });
    }
  }

  handleNavigate(sectionId) {
    this.setState({ activeSection: sectionId });
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  // Decides which items to show: search result (or all) + selected filter.
  getVisibleItems() {
    const source = this.state.searchResults !== null ? this.state.searchResults : this.state.items;

    if (this.state.selectedFilter === "ALL") {
      return source;
    }
    return source.filter((item) => item.status === this.state.selectedFilter);
  }

  getEmptyMessage() {
    if (this.state.searchResults !== null) {
      return 'No items found for "' + this.state.searchTerm.trim() + '". Try a different name.';
    }
    if (this.state.items.length === 0) {
      return "No reports yet. Report a lost or found item to get started.";
    }
    return this.state.selectedFilter === "LOST" ? "No lost items to show." : "No found items to show.";
  }

  renderItems() {
    if (this.state.loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      );
    }

    return (
      <ItemList
        items={this.getVisibleItems()}
        emptyMessage={this.getEmptyMessage()}
        onDelete={this.handleDelete}
      />
    );
  }

  render() {
    return (
      <div className="app">
        <Navbar activeSection={this.state.activeSection} onNavigate={this.handleNavigate} />

        <main className="container">
          {this.state.successMessage ? (
            <div className="toast toast-success">{this.state.successMessage}</div>
          ) : null}

          {this.state.error ? (
            <div className="toast toast-error">
              <span>{this.state.error}</span>
              <span className="toast-actions">
                <button type="button" className="link-btn" onClick={this.loadItems}>
                  Try again
                </button>
                <button type="button" className="link-btn" onClick={this.dismissError}>
                  Dismiss
                </button>
              </span>
            </div>
          ) : null}

          <Dashboard items={this.state.items} />

          <section id="report" className="section">
            <div className="section-header">
              <div>
                <h2>Report an Item</h2>
                <p className="section-sub">Lost something or found something? Add a report below.</p>
              </div>
            </div>
            <div className="form-grid">
              <ItemForm formType="LOST" onSubmit={(data) => this.handleReport("LOST", data)} />
              <ItemForm formType="FOUND" onSubmit={(data) => this.handleReport("FOUND", data)} />
            </div>
          </section>

          <section id="items" className="section">
            <div className="section-header">
              <div>
                <h2>All Reports</h2>
                <p className="section-sub">Search by name or filter by lost and found.</p>
              </div>
            </div>
            <div className="toolbar">
              <SearchBar
                searchTerm={this.state.searchTerm}
                isSearching={this.state.searchResults !== null}
                onSearchChange={this.handleSearchChange}
                onSearch={this.handleSearch}
                onClear={this.handleClearSearch}
              />
              <FilterButtons
                selectedFilter={this.state.selectedFilter}
                onFilterChange={this.handleFilterChange}
              />
            </div>
            {this.renderItems()}
          </section>

          <MatchResults
            results={this.state.matchingResults}
            loading={this.state.matchesLoading}
            checked={this.state.matchesChecked}
            onFindMatches={this.handleFindMatches}
          />
        </main>

        <Footer />
      </div>
    );
  }
}

export default App;
