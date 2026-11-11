import React from "react";

const CATEGORIES = ["Electronics", "Wallet", "ID Card", "Books", "Accessories", "Keys", "Other"];

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

// Stateful component: it keeps the form values in its own state.
// props.formType is "LOST" or "FOUND". props.onSubmit is a callback to the parent.
class ItemForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      category: "",
      description: "",
      location: "",
      date: "",
      imageUrl: "",
      errors: {},
      submitting: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // onChange: one handler for every input (uses the input's name attribute).
  handleChange(event) {
    const field = event.target.name;
    const value = event.target.value;
    this.setState({ [field]: value });
  }

  // Returns an object with one message for every invalid field.
  validate() {
    const errors = {};

    if (this.state.name.trim() === "") {
      errors.name = "Item name is required";
    }
    if (this.state.category === "") {
      errors.category = "Please select a category";
    }
    if (this.state.description.trim() === "") {
      errors.description = "Description is required";
    }
    if (this.state.location.trim() === "") {
      errors.location = "Location is required";
    }
    if (this.state.date === "") {
      errors.date = "Date is required";
    } else if (this.state.date > getToday()) {
      errors.date = "Date cannot be in the future";
    }
    if (this.state.imageUrl.trim() !== "" && !/^https?:\/\//i.test(this.state.imageUrl.trim())) {
      errors.imageUrl = "Image URL must start with http:// or https://";
    }

    return errors;
  }

  // onSubmit: validate, then send the data to the parent using the callback.
  async handleSubmit(event) {
    event.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors });
    if (Object.keys(errors).length > 0) {
      return;
    }

    this.setState({ submitting: true });

    const success = await this.props.onSubmit({
      name: this.state.name.trim(),
      category: this.state.category,
      description: this.state.description.trim(),
      location: this.state.location.trim(),
      date: this.state.date,
      imageUrl: this.state.imageUrl.trim()
    });

    if (success) {
      // Clear the form after a successful save.
      this.setState({
        name: "",
        category: "",
        description: "",
        location: "",
        date: "",
        imageUrl: "",
        errors: {},
        submitting: false
      });
    } else {
      this.setState({ submitting: false });
    }
  }

  renderError(field) {
    if (!this.state.errors[field]) return null;
    return <span className="field-error">{this.state.errors[field]}</span>;
  }

  render() {
    const isLost = this.props.formType === "LOST";
    const word = isLost ? "Lost" : "Found";
    const formClass = isLost ? "form-card form-lost" : "form-card form-found";
    const idPrefix = isLost ? "lost-" : "found-";

    return (
      <form className={formClass} onSubmit={this.handleSubmit} noValidate>
        <h3>Report {word} Item</h3>

        <label htmlFor={idPrefix + "name"}>Item name</label>
        <input
          id={idPrefix + "name"}
          name="name"
          type="text"
          placeholder="e.g. Black Wallet"
          value={this.state.name}
          onChange={this.handleChange}
        />
        {this.renderError("name")}

        <label htmlFor={idPrefix + "category"}>Category</label>
        <select
          id={idPrefix + "category"}
          name="category"
          value={this.state.category}
          onChange={this.handleChange}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {this.renderError("category")}

        <label htmlFor={idPrefix + "description"}>Description</label>
        <textarea
          id={idPrefix + "description"}
          name="description"
          rows="3"
          placeholder="Colour, brand, marks or anything that identifies the item"
          value={this.state.description}
          onChange={this.handleChange}
        />
        {this.renderError("description")}

        <label htmlFor={idPrefix + "location"}>{word} location</label>
        <input
          id={idPrefix + "location"}
          name="location"
          type="text"
          placeholder="e.g. NMAMIT Library"
          value={this.state.location}
          onChange={this.handleChange}
        />
        {this.renderError("location")}

        <label htmlFor={idPrefix + "date"}>Date {word.toLowerCase()}</label>
        <input
          id={idPrefix + "date"}
          name="date"
          type="date"
          max={getToday()}
          value={this.state.date}
          onChange={this.handleChange}
        />
        {this.renderError("date")}

        <label htmlFor={idPrefix + "imageUrl"}>Image URL (optional)</label>
        <input
          id={idPrefix + "imageUrl"}
          name="imageUrl"
          type="text"
          placeholder="https://..."
          value={this.state.imageUrl}
          onChange={this.handleChange}
        />
        {this.renderError("imageUrl")}

        <button type="submit" className="btn btn-primary" disabled={this.state.submitting}>
          {this.state.submitting ? "Saving..." : "Report " + word + " Item"}
        </button>
      </form>
    );
  }
}

export default ItemForm;
