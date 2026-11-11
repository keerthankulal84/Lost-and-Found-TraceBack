// Entry point of the backend: Express server + GraphQL endpoint.
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { buildSchema } = require("graphql");
const { createHandler } = require("graphql-http/lib/use/express");

const connectDatabase = require("./config/database");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Allow the React app to call this server.
app.use(cors({ origin: CLIENT_URL }));

// Build the GraphQL schema from the type definitions.
const schema = buildSchema(typeDefs);

// GraphQL endpoint: POST http://localhost:5000/graphql
app.all("/graphql", createHandler({ schema: schema, rootValue: resolvers }));

app.get("/", (req, res) => {
  res.send("TraceBack API is running. Use POST /graphql");
});

// Error handling for unknown routes and unexpected errors.
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// Connect to MongoDB first, then start the server.
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running at http://localhost:" + PORT);
      console.log("GraphQL endpoint: http://localhost:" + PORT + "/graphql");
    });
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB: " + error.message);
    console.error("Start MongoDB or check MONGODB_URI in server/.env");
    process.exit(1);
  });
