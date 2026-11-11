import React from "react";

function formatDate(dateText) {
  if (!dateText) return "Date not given";
  return new Date(dateText).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  });
}

// Stateless component: shows one item received through props.
// props.onDelete is optional. If it is not given, no Delete button is shown.
class ItemCard extends React.Component {
  handleDeleteClick(item) {
    if (window.confirm('Delete the report "' + item.name + '"? This cannot be undone.')) {
      this.props.onDelete(item.id);
    }
  }

  render() {
    const item = this.props.item;
    const isLost = item.status === "LOST";

    return (
      <article className="item-card">
        <div className="card-image">
          <span className="card-placeholder">No image</span>
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              onError={(event) => {
                event.target.style.display = "none";
              }}
            />
          ) : null}
          <span className={isLost ? "badge badge-lost" : "badge badge-found"}>
            {isLost ? "Lost" : "Found"}
          </span>
        </div>

        <div className="card-body">
          <h3>{item.name}</h3>
          <span className="category-tag">{item.category}</span>
          <p className="card-description">{item.description || "No description"}</p>
          <p className="card-meta">
            <strong>Location:</strong> {item.location}
          </p>
          <p className="card-meta">
            <strong>Date:</strong> {formatDate(item.date)}
          </p>
        </div>

        {this.props.onDelete ? (
          <div className="card-footer">
            <button type="button" className="btn btn-danger" onClick={() => this.handleDeleteClick(item)}>
              Delete
            </button>
          </div>
        ) : null}
      </article>
    );
  }
}

export default ItemCard;
