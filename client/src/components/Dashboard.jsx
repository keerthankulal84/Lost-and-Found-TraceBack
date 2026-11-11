import React from "react";

// Stateless component: statistics are calculated from the items prop.
class Dashboard extends React.Component {
  render() {
    const items = this.props.items;
    const lostCount = items.filter((item) => item.status === "LOST").length;
    const foundCount = items.filter((item) => item.status === "FOUND").length;

    return (
      <section id="dashboard" className="dashboard">
        <div className="hero">
          <h1>Every lost item deserves a way back.</h1>
          <p>
            TraceBack is one place to report lost and found belongings, search all reports
            and discover possible matches between them.
          </p>
        </div>
        <div className="stats">
          <div className="stat-card">
            <span className="stat-number">{items.length}</span>
            <span className="stat-label">Total reports</span>
          </div>
          <div className="stat-card stat-lost">
            <span className="stat-number">{lostCount}</span>
            <span className="stat-label">Lost items</span>
          </div>
          <div className="stat-card stat-found">
            <span className="stat-number">{foundCount}</span>
            <span className="stat-label">Found items</span>
          </div>
        </div>
      </section>
    );
  }
}

export default Dashboard;
