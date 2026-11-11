import React from "react";
import ItemCard from "./ItemCard.jsx";

// Stateless component: shows each lost report next to its possible found report.
// props.results looks like [{ lostItem, foundItem, score }]
class MatchResults extends React.Component {
  renderBody() {
    const { results, loading, checked } = this.props;

    if (loading) {
      return (
        <div className="loading">
          <div className="spinner"></div>
          <p>Looking for matches...</p>
        </div>
      );
    }

    if (!checked) {
      return (
        <div className="empty-state">Click "Find Matches" to compare lost reports with found reports.</div>
      );
    }

    if (results.length === 0) {
      return (
        <div className="empty-state">
          No possible matches found yet. A match needs a score of at least 50%.
        </div>
      );
    }

    return results.map((result) => (
      <div className="match-row" key={result.lostItem.id + "-" + result.foundItem.id}>
        <h3 className="match-title">{result.lostItem.name.toUpperCase()}</h3>
        <div className="match-compare">
          <div className="match-side">
            <p className="match-label match-label-lost">Lost Report</p>
            <ItemCard item={result.lostItem} />
          </div>
          <div className="match-middle">
            <span className="match-arrow">&rarr;</span>
            <span className="match-text">Possible Match</span>
            <span className="match-arrow">&rarr;</span>
          </div>
          <div className="match-side">
            <p className="match-label match-label-found">Found Report</p>
            <ItemCard item={result.foundItem} />
          </div>
        </div>
        <p className="match-score">Match Score: {result.score}%</p>
      </div>
    ));
  }

  render() {
    return (
      <section id="matches" className="section">
        <div className="section-header">
          <div>
            <h2>Smart Matching</h2>
            <p className="section-sub">
              Score = same category (40%) + similar item name (35%) + same location (25%).
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => this.props.onFindMatches()}
            disabled={this.props.loading}
          >
            Find Matches
          </button>
        </div>
        {this.renderBody()}
      </section>
    );
  }
}

export default MatchResults;
