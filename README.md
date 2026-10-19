
# Teacher Management System

A full-stack web application for managing teachers,
assessments, and performance reports.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database
- PostgreSQL

## Features

- User Registration and Login
- Role-Based Access Control (User, Manager, Admin)
- Teacher CRUD Operations
- Search, Filter, and Sorting
- Pagination
- KPI Dashboard
- Score Distribution Reports
- Responsive Design
- API Error Handling
- Loading and Empty States

## Project Structure

teacher-management/
├── frontend/    React + TypeScript
├── backend/     Node.js + Express
└── README.md


## Installation & Setup

### Prerequisites

Make sure the following software is installed:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone Repository

```bash
git clone https://github.com/yohaneshp2406/teacher-management.git
cd teacher-management
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_NAME=teacher_portal
JWT_SECRET=your_secure_jwt_secret
```

Replace the placeholder values with your own configuration.


### 3. Setup Database

Create a PostgreSQL database:

```bash
psql -U postgres -h localhost -d postgres -c "CREATE DATABASE teacher_portal;"
```

From the `backend` directory, run the database schema:

```bash
psql -U postgres -h localhost -d teacher_portal -f schema.sql
```

This creates the following tables:

- `users` — stores user accounts, hashed passwords, and roles.
- `teachers` — stores teacher names and scores.

Verify the tables:

```bash
psql -U postgres -h localhost -d teacher_portal -c "\dt"
```

Expected tables:

- users
- teachers

**Note:** The schema creates empty tables. No default accounts or teacher records are inserted.

### 4. Start Backend

From the `backend` directory:

```bash
node --env-file=.env server.js
```

Backend URL:

http://localhost:3000

### 5. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

http://localhost:5173

### 6. Open Application

Open http://localhost:5173 in your browser.

Register an account and log in to access the Teacher Dashboard.

### Security Notes

- Never commit `.env` files to Git.
- Passwords are hashed using bcrypt.
- Protected API endpoints require JWT authentication.
- Access to Create, Update, and Delete operations depends on user roles.


## API Documentation

Base URL: `http://localhost:3000`

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login and receive JWT | Public |
| GET | `/profile` | Get authenticated profile | Authenticated |
| GET | `/admin` | Access admin endpoint | Admin |

### Teacher Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/teachers` | Get all teachers | Authenticated |
| POST | `/teachers` | Create a teacher | Manager, Admin |
| PATCH | `/teachers/:id` | Update a teacher | Manager, Admin |
| DELETE | `/teachers/:id` | Delete a teacher | Admin |

### Authentication

Protected endpoints require a JWT access token:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### Example: Create Teacher

**Request**

```http
POST /teachers
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**JSON Body**

```json
{
  "name": "Grace",
  "score": 90
}
```

### Role-Based Permissions

| Action | User | Manager | Admin |
|---|---|---|---|
| Read Teachers | Yes | Yes | Yes |
| Create Teacher | No | Yes | Yes |
| Update Teacher | No | Yes | Yes |
| Delete Teacher | No | No | Yes |

### HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required or invalid token |
| 403 | Permission denied |
| 404 | Resource not found |
| 500 | Internal server error |
