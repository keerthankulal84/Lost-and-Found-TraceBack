import React from "react";

// Stateless component: only shows data received through props.
class Navbar extends React.Component {
  render() {
    const links = [
      { id: "dashboard", label: "Dashboard" },
      { id: "report", label: "Report" },
      { id: "items", label: "Items" },
      { id: "matches", label: "Matches" }
    ];

    return (
      <header className="navbar">
        <div className="navbar-inner">
          <div className="brand" onClick={() => this.props.onNavigate("dashboard")}>
            <span className="brand-mark">T</span>
            <span className="brand-name">TraceBack</span>
          </div>
          <nav className="nav-links">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                className={this.props.activeSection === link.id ? "nav-link active" : "nav-link"}
                onClick={() => this.props.onNavigate(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
    );
  }
}

export default Navbar;
