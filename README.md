# CRM Rashmi Service

Backend REST API for the CRM Lead Management System 

## 📄 Full Project Documentation
[View Complete Project Documentation.](https://docs.google.com/document/d/1dmyBJrCm9WAt9mMHLWn-fVDW9ONAr_usApF42TjYXyA/edit?usp=sharing)

## 🔗 Links
- **Frontend:** https://crm-rashmi-portal.vercel.app
- **Backend:** https://crm-rashmi-service.onrender.com
- **Demo Video:** [Watch demo]((https://drive.google.com/file/d/1e80M_J_5s01ooRv9SYLK3NDffAg91bE5/view?usp=drive_link))

## 🔑 Test Credentials
| Email | Password |
|-------|----------|
| admin@example.com | password123 |
| rashmi@example.com | password123 |

## 🛠 Tech Stack
- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- bcryptjs for password hashing

## ⚙️ Setup Instructions

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

## 🗄️ Database Design

Three tables connected via foreign keys:

| Table | Description |
|-------|-------------|
| users | Salesperson accounts with hashed passwords |
| leads | All lead data — name, company, status, deal value |
| notes | Notes per lead, linked via `lead_id` FK with ON DELETE CASCADE |

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/login | ❌ | Login, returns JWT |
| GET | /api/leads | ✅ | Get all leads (supports search + filter) |
| POST | /api/leads | ✅ | Create lead |
| GET | /api/leads/:id | ✅ | Get single lead with notes |
| PUT | /api/leads/:id | ✅ | Update lead |
| DELETE | /api/leads/:id | ✅ | Delete lead |
| POST | /api/leads/:id/notes | ✅ | Add note to lead |
| DELETE | /api/notes/:id | ✅ | Delete note |
| GET | /api/dashboard | ✅ | Stats summary |

## 🌍 Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default 5000) |
| JWT_SECRET | Secret key for JWT signing |
| DB_PASSWORD | Supabase PostgreSQL password |

## ⚠️ Known Limitations
- Render free tier sleeps after 15 min of inactivity — first request may take ~30 seconds to wake up
- No pagination on leads list
- No role-based access control

## 💭 Reflection

The biggest challenge was migrating from SQLite to PostgreSQL for proper cloud deployment. I learned about connection pooling, IPv4/IPv6 networking differences, how Supabase session pooler works, and how to safely handle environment variables across local and production environments. I also learned how JWT middleware works as a gatekeeper for all protected routes and how bcrypt one-way hashing protects passwords even if the database is compromised.
