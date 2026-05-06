# CRM Rashmi Service

Backend REST API for the CRM Lead Management System built for the SE Internship assessment.

## Tech Stack
- Node.js + Express
- SQLite (better-sqlite3)
- JWT Authentication
- bcryptjs for password hashing

## Features
- JWT-based authentication
- Full CRUD for leads
- Notes per lead
- Dashboard stats API
- Search and filtering (status, source, assigned salesperson)

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/crm-rashmi-service.git
cd crm-rashmi-service
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
PORT=5000
JWT_SECRET=your_secret_key_here

### 4. Seed the database
```bash
npm run seed
```

### 5. Start the server
```bash
npm run dev
```

Server runs on http://localhost:5000

## Test Credentials
| Email | Password |
|-------|----------|
| admin@example.com | password123 |
| rashmi@example.com | password123 |

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Login |
| GET | /api/leads | Get all leads |
| POST | /api/leads | Create lead |
| GET | /api/leads/:id | Get lead + notes |
| PUT | /api/leads/:id | Update lead |
| DELETE | /api/leads/:id | Delete lead |
| POST | /api/leads/:id/notes | Add note |
| DELETE | /api/notes/:id | Delete note |
| GET | /api/dashboard | Dashboard stats |

## Database Design
- **users** — stores salesperson accounts
- **leads** — stores all lead data with status and deal value
- **notes** — linked to leads via foreign key

## Known Limitations
- No pagination on leads list
- No role-based access control
- Not deployed (runs locally only)

## Reflection
This project helped me understand how a real sales CRM works end to end.
The most challenging part was designing the database schema to handle leads and notes
with proper foreign key relationships. I learned how JWT authentication flow works
from login to protected API routes.

