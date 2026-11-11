// Resolver functions: each query/mutation runs a real MongoDB operation.
const mongoose = require("mongoose");
const Item = require("../models/Item");

// ---------- Smart matching settings ----------
const CATEGORY_WEIGHT = 40;
const NAME_WEIGHT = 35;
const LOCATION_WEIGHT = 25;
const MIN_MATCH_SCORE = 50; // matches below this score are not shown

// ---------- Helper functions ----------

// Convert a MongoDB document into the shape of the GraphQL Item type.
function formatItem(doc, matchScore) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    category: doc.category,
    description: doc.description,
    location: doc.location,
    date: doc.date ? doc.date.toISOString().slice(0, 10) : null,
    imageUrl: doc.imageUrl,
    status: doc.status,
    createdAt: doc.createdAt ? doc.createdAt.toISOString() : null,
    matchScore: matchScore === undefined ? null : matchScore
  };
}

function checkId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new Error("Invalid item id");
  }
}

// Lowercase and trim a text so comparison is case-insensitive.
function clean(text) {
  return String(text || "").trim().toLowerCase();
}

// Returns a number from 0 to 1 that tells how similar two item names are.
function nameSimilarity(nameA, nameB) {
  const a = clean(nameA);
  const b = clean(nameB);

  if (a === "" || b === "") return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.8; // partial match

  // Count how many words are common in both names.
  const wordsA = a.split(/\s+/);
  const wordsB = b.split(/\s+/);
  const commonWords = wordsA.filter((word) => wordsB.includes(word)).length;
  return commonWords / Math.max(wordsA.length, wordsB.length);
}

// Calculates the match percentage (0 to 100) between two reports.
function calculateMatchScore(itemA, itemB) {
  let score = 0;

  if (clean(itemA.category) === clean(itemB.category)) {
    score += CATEGORY_WEIGHT;
  }

  score += nameSimilarity(itemA.name, itemB.name) * NAME_WEIGHT;

  if (clean(itemA.location) === clean(itemB.location)) {
    score += LOCATION_WEIGHT;
  }

  return Math.round(score);
}

// Shared logic for reportLostItem and reportFoundItem.
async function createItem(args, status) {
  const item = await Item.create({
    name: args.name,
    category: args.category,
    description: args.description,
    location: args.location,
    date: args.date ? new Date(args.date) : undefined,
    imageUrl: args.imageUrl,
    status: status
  });
  return formatItem(item);
}

// ---------- Resolvers ----------
const resolvers = {
  // ----- Queries -----
  getAllItems: async () => {
    const items = await Item.find().sort({ createdAt: -1 });
    return items.map((item) => formatItem(item));
  },

  getItem: async ({ id }) => {
    checkId(id);
    const item = await Item.findById(id);
    return item ? formatItem(item) : null;
  },

  searchItems: async ({ name }) => {
    // Escape special characters so the text is searched as normal text.
    const safeName = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const items = await Item.find({ name: { $regex: safeName, $options: "i" } }).sort({ createdAt: -1 });
    return items.map((item) => formatItem(item));
  },

  getItemsByStatus: async ({ status }) => {
    const upperStatus = status.toUpperCase();
    if (upperStatus !== "LOST" && upperStatus !== "FOUND") {
      throw new Error("Status must be LOST or FOUND");
    }
    const items = await Item.find({ status: upperStatus }).sort({ createdAt: -1 });
    return items.map((item) => formatItem(item));
  },

  getPossibleMatches: async ({ itemId }) => {
    checkId(itemId);
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    // Compare only with reports of the opposite status.
    const oppositeStatus = item.status === "LOST" ? "FOUND" : "LOST";
    const candidates = await Item.find({ status: oppositeStatus });

    return candidates
      .map((candidate) => ({ candidate: candidate, score: calculateMatchScore(item, candidate) }))
      .filter((result) => result.score >= MIN_MATCH_SCORE)
      .sort((a, b) => b.score - a.score)
      .map((result) => formatItem(result.candidate, result.score));
  },

  // ----- Mutations -----
  reportLostItem: async (args) => createItem(args, "LOST"),

  reportFoundItem: async (args) => createItem(args, "FOUND"),

  deleteItem: async ({ id }) => {
    checkId(id);
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) {
      throw new Error("Item not found");
    }
    return true;
  }
};

module.exports = resolvers;
module.exports.calculateMatchScore = calculateMatchScore;
