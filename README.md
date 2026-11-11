# TraceBack – Lost & Found Intelligence Platform

TraceBack is a MERN stack web application where people can report lost items, report found items, search all reports and see possible matches between lost and found reports. It is an MCA individual micro-project.

> Tagline: *Every lost item deserves a way back.*

## Features

- Report a lost item and report a found item (with validation)
- View all reports as cards with Lost / Found badges
- Search items by name
- Filter: All, Lost, Found
- Delete a report (with confirmation)
- Dashboard with total, lost and found counts
- Smart Matching: compares lost and found reports and shows a match percentage

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (JavaScript, JSX, class components, no hooks) |
| Styling | Plain CSS3 |
| Backend | Node.js + Express.js (CommonJS) |
| API | GraphQL (`graphql` + `graphql-http`) |
| Database | MongoDB + Mongoose |
| API communication | Native Fetch API |

Vite is used only as the tool that starts and builds the React app.

## Folder structure

```
TraceBack/
├── client/
│   ├── public/favicon.svg
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── components/   Navbar, Dashboard, ItemForm, ItemCard, ItemList,
│       │                 SearchBar, FilterButtons, MatchResults, Footer (.jsx)
│       ├── services/graphql.js
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── main.jsx
├── server/
│   ├── config/database.js
│   ├── models/Item.js
│   ├── graphql/typeDefs.js
│   ├── graphql/resolvers.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── PROJECT_EXPLANATION.md
└── README.md
```

## Prerequisites (Ubuntu Linux)

1. **Node.js 18 or newer** and npm. Check with:

```bash
node -v
npm -v
```

If Node.js is missing:

```bash
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

2. **MongoDB** – use ONE of the two options below.

### Option A: Local MongoDB (Ubuntu 24.04)

```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
sudo systemctl status mongod
```

On Ubuntu 22.04 replace `noble` with `jammy`. If these steps fail, follow the official guide: https://www.mongodb.com/docs/manual/administration/install-on-linux/

The status command should show `active (running)`.

### Option B: MongoDB Atlas (cloud, free tier)

1. Create a free cluster at https://www.mongodb.com/atlas
2. Create a database user and allow your IP address in Network Access.
3. Copy the connection string and use it as `MONGODB_URI` in `server/.env` (see below).

## Installation

Open a terminal in the project folder (`TraceBack`).

```bash
cd server
npm install
cp .env.example .env
```

```bash
cd ../client
npm install
```

## Environment configuration

Edit `server/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/traceback_db
PORT=5000
CLIENT_URL=http://localhost:3000
```

- For Atlas, replace `MONGODB_URI` with your Atlas connection string (database name `traceback_db`).
- The database `traceback_db` and the collection `items` are created automatically when the first item is saved.
- Never put real credentials in `.env.example` or in the React code.

## Start the backend

```bash
cd server
npm start
```

Expected output:

```
MongoDB connected: traceback_db
Server running at http://localhost:5000
GraphQL endpoint: http://localhost:5000/graphql
```

If you see `Could not connect to MongoDB`, MongoDB is not running or `MONGODB_URI` is wrong.

## Start the frontend

Open a **second** terminal:

```bash
cd client
npm start
```

## Run the application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- GraphQL endpoint: http://localhost:5000/graphql

Open http://localhost:3000 in the browser. Keep both terminals running.

## Quick API test (optional)

```bash
curl -s -X POST http://localhost:5000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ getAllItems { id name status } }"}'
```

## Documentation

See `PROJECT_EXPLANATION.md` for the full explanation of the code, GraphQL schema, components and the matching algorithm.
