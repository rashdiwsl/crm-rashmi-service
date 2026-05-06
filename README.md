# CRM Rashmi Service

Backend REST API for the CRM Lead Management System built for the SE Internship assessment.

## Live Demo
- Frontend: https://crm-rashmi-portal.vercel.app
- Backend API: https://crm-rashmi-service.onrender.com

## Tech Stack
- Node.js + Express
- PostgreSQL (Supabase)
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
git clone https://github.com/rashdiwsl/crm-rashmi-service.git
cd crm-rashmi-service
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
PORT=5000
JWT_SECRET=your_secret_key_here
DB_PASSWORD=your_supabase_password

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
- **users** — stores salesperson accounts with hashed passwords
- **leads** — stores all lead data with status and deal value
- **notes** — linked to leads via foreign key with ON DELETE CASCADE

## Environment Variables
| Variable | Description |
|----------|-------------|
| PORT | Server port (default 5000) |
| JWT_SECRET | Secret key for JWT signing |
| DB_PASSWORD | Supabase PostgreSQL password |

## Known Limitations
- Render free tier spins down after inactivity — first request may take 30 seconds
- No pagination on leads list
- No role-based access control

## Reflection
Building this project helped me understand how a real sales CRM works end to end. The most challenging part was migrating from SQLite to PostgreSQL on Supabase for proper cloud deployment. I learned how JWT authentication flows from login to protected API routes, how to structure a REST API with Express, and how to debug database connection issues across different environments.