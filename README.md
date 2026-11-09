# Expense Tracker

A full-stack expense tracking app. Add, edit and delete expenses, filter them by month and category, and see monthly totals per category.

## Tech stack

- **Backend:** Java 17, Spring Boot 4.1 (Web, Data JPA, Validation), Maven
- **Database:** MySQL 8
- **Frontend:** React (Vite), plain CSS

## Features

- Full CRUD for expenses (create, read, update, delete)
- Filter by month and category
- Monthly summary: total spent and total per category
- Input validation with clear error messages
- Money stored as `BigDecimal` to avoid floating-point rounding errors

## Run it locally

**Prerequisites:** Java 17 or newer, Node.js 22 or newer, MySQL 8.

### 1. Database

```sql
CREATE DATABASE expense_tracker;
```

The `expense` table is created automatically on the first start.

### 2. Backend

The database password is read from an environment variable. It is not stored in the code.

Windows (PowerShell):

```powershell
$env:DB_PASSWORD="your_mysql_password"
.\mvnw spring-boot:run
```

macOS / Linux:

```bash
export DB_PASSWORD="your_mysql_password"
./mvnw spring-boot:run
```

The API runs at `http://localhost:8080`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/expenses` | List all expenses |
| GET | `/api/expenses?month=2026-11&category=Food` | Filter by month and optional category |
| GET | `/api/expenses/summary?month=2026-11` | Total and per-category totals for a month |
| POST | `/api/expenses` | Create an expense |
| PUT | `/api/expenses/{id}` | Update an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |

Status codes: `201` created, `204` deleted, `400` validation error, `404` not found.

## Limitations and next steps

- No user login. Everyone sees the same data.
- No automated tests yet.
- Categories are a fixed list in the frontend.
- Planned: user accounts, tests, Docker setup, charts.