import React from "react";
import ItemCard from "./ItemCard.jsx";

// Stateless component: receives the list and passes each item to ItemCard.
class ItemList extends React.Component {
  render() {
    const items = this.props.items;

    if (items.length === 0) {
      return <div className="empty-state">{this.props.emptyMessage}</div>;
    }

    return (
      <div className="item-grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onDelete={this.props.onDelete} />
        ))}
      </div>
    );
  }
}

export default ItemList;
