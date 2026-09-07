# Expense Tracker Application

Full-stack Expense Tracker built with:

- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Auth**: JWT based authentication

## Features

- User registration & login
- Add / Edit / Delete income & expenses
- Categories with icons & colors
- Dashboard with balance, income, expense totals
- Pie chart for expenses by category
- Filter transactions by type & category
- Responsive modern UI

## Project Structure

```
expense-tracker/
├── backend/          # Express + MongoDB API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
├── frontend/         # React + Vite app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       └── services/
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Setup & Run

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm install
npm run dev
```

Server starts at `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at `http://localhost:5173`

### 3. Environment

Backend `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

## API Overview

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | /api/auth/register    | Register                 |
| POST   | /api/auth/login       | Login                    |
| GET    | /api/auth/me          | Current user             |
| GET    | /api/expenses         | List expenses            |
| GET    | /api/expenses/stats   | Stats (income/expense)   |
| POST   | /api/expenses         | Create                   |
| PUT    | /api/expenses/:id     | Update                   |
| DELETE | /api/expenses/:id     | Delete                   |
| GET    | /api/categories       | List categories          |

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Axios
- React Router v6
- Recharts
- Lucide React icons
- Express.js
- Mongoose
- JWT + bcryptjs
- MongoDB

## Notes

- Default categories are seeded automatically on first request.
- All expense routes are protected with JWT.
- Currency is displayed in ₹ (Indian Rupee) – change in frontend if needed.
# expense_tracker_app
