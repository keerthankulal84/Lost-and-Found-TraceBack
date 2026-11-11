// Mongoose model for a lost or found report.
// MongoDB collection name will be "items".
const mongoose = require("mongoose");

const CATEGORIES = ["Electronics", "Wallet", "ID Card", "Books", "Accessories", "Keys", "Other"];

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    trim: true,
    maxlength: [100, "Item name must be 100 characters or less"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: { values: CATEGORIES, message: "Invalid category" }
  },
  description: {
    type: String,
    trim: true,
    default: ""
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true
  },
  date: {
    type: Date
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ""
  },
  status: {
    type: String,
    required: true,
    enum: { values: ["LOST", "FOUND"], message: "Status must be LOST or FOUND" }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Item = mongoose.model("Item", itemSchema, "items");

module.exports = Item;
module.exports.CATEGORIES = CATEGORIES;
