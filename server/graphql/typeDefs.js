// GraphQL schema (types, queries and mutations).
const typeDefs = `
  type Item {
    id: ID!
    name: String!
    category: String!
    description: String
    location: String!
    date: String
    imageUrl: String
    status: String!
    createdAt: String
    matchScore: Int
  }

  type Query {
    getAllItems: [Item!]!
    getItem(id: ID!): Item
    searchItems(name: String!): [Item!]!
    getItemsByStatus(status: String!): [Item!]!
    getPossibleMatches(itemId: ID!): [Item!]!
  }

  type Mutation {
    reportLostItem(
      name: String!
      category: String!
      description: String
      location: String!
      date: String
      imageUrl: String
    ): Item!

    reportFoundItem(
      name: String!
      category: String!
      description: String
      location: String!
      date: String
      imageUrl: String
    ): Item!

    deleteItem(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
