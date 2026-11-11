// All communication with the GraphQL server happens here using the native Fetch API.
const GRAPHQL_URL = "http://localhost:5000/graphql";

// Fields we ask for every time we fetch an item.
const ITEM_FIELDS = `
  id
  name
  category
  description
  location
  date
  imageUrl
  status
  createdAt
`;

// Sends one GraphQL request and returns result.data.
async function sendRequest(query, variables) {
  let response;

  try {
    response = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query, variables: variables })
    });
  } catch (networkError) {
    throw new Error("Cannot reach the server. Make sure the backend is running on port 5000.");
  }

  const result = await response.json();

  // Check for GraphQL errors before using result.data.
  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

export async function fetchAllItems() {
  const query = `
    query {
      getAllItems {
        ${ITEM_FIELDS}
      }
    }
  `;
  const data = await sendRequest(query);
  return data.getAllItems;
}

export async function fetchItem(id) {
  const query = `
    query GetItem($id: ID!) {
      getItem(id: $id) {
        ${ITEM_FIELDS}
      }
    }
  `;
  const data = await sendRequest(query, { id: id });
  return data.getItem;
}

export async function searchItems(name) {
  const query = `
    query SearchItems($name: String!) {
      searchItems(name: $name) {
        ${ITEM_FIELDS}
      }
    }
  `;
  const data = await sendRequest(query, { name: name });
  return data.searchItems;
}

export async function fetchItemsByStatus(status) {
  const query = `
    query ItemsByStatus($status: String!) {
      getItemsByStatus(status: $status) {
        ${ITEM_FIELDS}
      }
    }
  `;
  const data = await sendRequest(query, { status: status });
  return data.getItemsByStatus;
}

export async function reportLostItem(itemData) {
  const mutation = `
    mutation ReportLost(
      $name: String!
      $category: String!
      $description: String
      $location: String!
      $date: String
      $imageUrl: String
    ) {
      reportLostItem(
        name: $name
        category: $category
        description: $description
        location: $location
        date: $date
        imageUrl: $imageUrl
      ) {
        ${ITEM_FIELDS}
      }
    }
  `;
  const data = await sendRequest(mutation, itemData);
  return data.reportLostItem;
}

export async function reportFoundItem(itemData) {
  const mutation = `
    mutation ReportFound(
      $name: String!
      $category: String!
      $description: String
      $location: String!
      $date: String
      $imageUrl: String
    ) {
      reportFoundItem(
        name: $name
        category: $category
        description: $description
        location: $location
        date: $date
        imageUrl: $imageUrl
      ) {
        ${ITEM_FIELDS}
      }
    }
  `;
  const data = await sendRequest(mutation, itemData);
  return data.reportFoundItem;
}

export async function deleteItem(id) {
  const mutation = `
    mutation DeleteItem($id: ID!) {
      deleteItem(id: $id)
    }
  `;
  const data = await sendRequest(mutation, { id: id });
  return data.deleteItem;
}

export async function fetchPossibleMatches(itemId) {
  const query = `
    query PossibleMatches($itemId: ID!) {
      getPossibleMatches(itemId: $itemId) {
        ${ITEM_FIELDS}
        matchScore
      }
    }
  `;
  const data = await sendRequest(query, { itemId: itemId });
  return data.getPossibleMatches;
}
