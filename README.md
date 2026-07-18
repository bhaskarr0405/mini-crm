# Mini CRM — Client Lead Management System

A simple CRM for managing client leads generated from website contact forms.
Built with the **MERN** stack: MongoDB, Express, React, Node.js.

## Features

- Lead listing (name, email, source, status)
- Lead status pipeline: `new → contacted → converted` (plus `lost`)
- Notes and follow-ups per lead, with optional follow-up date
- Secure admin login (JWT-based auth, bcrypt password hashing)
- Search leads by name/email, filter by pipeline stage

## Tech stack

| Layer     | Choice                          |
|-----------|----------------------------------|
| Frontend  | React (Vite)                     |
| Backend   | Node.js + Express                |
| Database  | MongoDB + Mongoose                |
| Auth      | JWT + bcrypt                      |

## Project structure

```
mini-crm/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── models/                # Lead.js, Admin.js
│   ├── middleware/auth.js     # JWT verification
│   ├── routes/                 # authRoutes.js, leadRoutes.js
│   ├── server.js               # entry point, seeds admin account
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/         # Login, Dashboard, LeadTable, LeadModal
    │   ├── api.js               # fetch wrapper
    │   └── App.jsx
    └── vite.config.js
```

## Getting started

### 1. Database

Easiest option: create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas), or run MongoDB locally.

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run dev
```

The server starts on `http://localhost:5000` and automatically creates the
admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` the first time
it runs (skip this by removing those two variables).

### 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api` requests to the
backend on port 5000 (see `vite.config.js`), so no CORS setup is needed locally.

Log in with the admin email/password you set in `backend/.env`.

## API reference

All `/api/leads/*` routes require `Authorization: Bearer <token>`.

| Method | Route                          | Description                       |
|--------|---------------------------------|------------------------------------|
| POST   | `/api/auth/login`               | Log in, returns JWT                |
| GET    | `/api/auth/me`                  | Get current admin                  |
| GET    | `/api/leads`                    | List leads (`?status=&search=`)    |
| GET    | `/api/leads/:id`                | Get a single lead                  |
| POST   | `/api/leads`                    | Create a lead                      |
| PUT    | `/api/leads/:id`                | Update lead details                |
| PATCH  | `/api/leads/:id/status`         | Update lead status                 |
| DELETE | `/api/leads/:id`                | Delete a lead                      |
| POST   | `/api/leads/:id/notes`          | Add a note / follow-up             |
| DELETE | `/api/leads/:id/notes/:noteId`  | Delete a note                      |

### Connecting a real website contact form

Any external form can create a lead by POSTing to `/api/leads` (this
route requires an admin token, so either issue a service token for your
website's backend to use, or add a public unauthenticated endpoint before
`router.use(auth)` in `leadRoutes.js` if the form is fully public-facing).

## Deploying

- **Backend**: Render, Railway, or Fly.io all support Node + a `.env` file. Point `MONGO_URI` at your Atlas cluster.
- **Frontend**: Run `npm run build` in `frontend/`, then deploy the `dist/` folder to Vercel, Netlify, or similar. Update the API base URL / proxy target for production.

## Pushing to GitHub

```bash
cd mini-crm
git init
git add .
git commit -m "Initial commit: Mini CRM"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

`.env` is already gitignored — never commit real credentials.
