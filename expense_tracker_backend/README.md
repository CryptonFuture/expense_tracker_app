# Expense Tracker Backend

Node.js + Express.js + MongoDB API for Expense Tracker.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` from `.env.example` and update values:
```bash
cp .env.example .env
```

3. Make sure MongoDB is running locally or use MongoDB Atlas URI.

4. Start server:
```bash
npm run dev   # development with nodemon
# or
npm start     # production
```

API runs on `http://localhost:5000`

## Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Expenses
- `GET /api/expenses` - List expenses (query: type, category, startDate, endDate, page, limit)
- `GET /api/expenses/stats` - Get income/expense stats
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Categories
- `GET /api/categories` - List categories (seeds defaults if empty)
- `POST /api/categories` - Create category

All expense & category routes require Bearer token.
