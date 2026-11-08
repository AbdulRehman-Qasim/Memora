# Setup and Installation Guide

## Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL database instance (local or hosted, e.g. Supabase)

## Unified Quickstart

From the root project directory:

```bash
# 1. Install all dependencies (root, frontend, and backend)
npm run install:all

# 2. Configure environment variables
# Copy .env.example files to .env in both frontend and backend
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# 3. Setup backend database (Prisma)
npm run db:push

# 4. Start both applications in development mode
npm run dev
```

The frontend will run at `http://localhost:5173` and the backend will run at `http://localhost:5000`.

