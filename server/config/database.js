// Connects the server to MongoDB using Mongoose.
const mongoose = require("mongoose");

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing. Create server/.env from server/.env.example");
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log("MongoDB connected: " + mongoose.connection.name);
}

module.exports = connectDatabase;
