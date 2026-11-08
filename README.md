# Memoora - Unified Monorepo (MERN Notes Application)

## 1. Project Overview
Memoora is a production-grade full-stack personal notes application built using a unified Monorepo structure. It pairs a **React 19 / TypeScript / Vite** single-page application with a **Node.js / Express 5 / Prisma / PostgreSQL** REST API, featuring real-time synchronization over **Socket.io**.

---

## 2. Monorepo Architecture & Directory Structure

```
Memora/
├── backend/                  # Express REST API, Prisma schema, & Socket.io server
│   ├── prisma/               # Database schema & migrations
│   ├── src/                  # Controllers, services, routes, middleware, validations, utils
│   ├── tests/                # Mocha & Chai backend test suites
│   ├── package.json          # Backend-specific dependencies and scripts
│   └── .env.example          # Backend environment template
│
├── frontend/                 # Vite + React 19 + TypeScript frontend application
│   ├── public/               # Static assets & icons
│   ├── src/                  # Components, pages, context, services, types
│   ├── src/__tests__/        # Jest & React Testing Library test suites
│   ├── package.json          # Frontend-specific dependencies and scripts
│   └── .env.example          # Frontend environment template
│
├── docs/                     # Architectural, setup, & project documentation
│   ├── architecture/         # System design & security architecture
│   ├── api/                  # REST API endpoints documentation
│   ├── setup/                # Step-by-step setup guides
│   └── certificates/         # Program documentation & certificates
│
├── .github/                  # CI/CD workflows
├── .coderabbit.yaml          # CodeRabbit review rules
├── .editorconfig             # Editor configuration standards
├── .gitignore                # Root gitignore rules
├── .prettierrc               # Prettier formatting rules
├── package.json              # Root orchestration & scripts (npm --prefix + concurrently)
├── README.md                 # Project guide & reference
└── sonar-project.properties  # SonarQube multi-project configuration
```

---

## 3. Technology Stack

### Frontend
- **Framework**: React 19, TypeScript
- **Tooling**: Vite 8
- **Routing**: React Router DOM 7
- **Sanitization & Security**: DOMPurify
- **Real-Time Client**: Socket.io Client
- **Notifications**: React Hot Toast
- **Testing**: Jest 30, React Testing Library, Babel

### Backend
- **Framework**: Node.js, Express 5
- **Database & ORM**: PostgreSQL via Prisma ORM 6
- **Authentication**: JWT (JSON Web Tokens) with `HttpOnly` and `SameSite: Strict` cookies
- **Security**: Helmet, CORS origin restriction, custom CSRF origin validation
- **Real-Time Engine**: Socket.io 4.8
- **Logging**: Pino & Pino-HTTP structured JSON logging
- **Validation**: Express-Validator
- **Testing**: Mocha, Chai, Sinon, Supertest

---

## 4. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local PostgreSQL instance or cloud database (e.g., Supabase)

---

## 5. Quickstart & Installation

From the root directory:

```bash
# 1. Install all dependencies (backend, frontend, and root concurrently)
npm run install:all

# 2. Configure environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### Environment Variables Configuration

**Backend (`backend/.env`):**
```ini
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"
FRONTEND_URL="http://localhost:5173"
```

**Frontend (`frontend/.env`):**
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 6. Running the Applications

### Run both applications concurrently (Recommended for development):
```bash
npm run dev
```
- Frontend starts on: `http://localhost:5173`
- Backend API starts on: `http://localhost:5000`

### Run applications independently:
```bash
# Start backend API only
npm run dev:backend

# Start frontend application only
npm run dev:frontend
```

---

## 7. Database Setup & Migrations
```bash
# Push Prisma schema to the configured PostgreSQL database
npm run db:push

# Generate Prisma Client
npm run db:generate
```

---

## 8. Testing & Quality Checks

Run the automated test suites directly from the root repository:

```bash
# Run all tests (backend + frontend)
npm test

# Run backend Mocha/Chai tests only
npm run test:backend

# Run frontend Jest tests only
npm run test:frontend

# Run backend TypeScript checks
npm run type-check

# Run linters across backend and frontend
npm run lint

# Build frontend production bundle
npm run build
```

---

## 9. SonarQube Analysis
SonarQube is configured to analyze both frontend and backend source code and coverage reports:
```properties
sonar.sources=backend/src,frontend/src
sonar.tests=backend/tests,frontend/src/__tests__
sonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info
```
Run analysis with your local SonarScanner:
```bash
sonar-scanner
```

---

## 10. Git Branching & PR Workflow
- `main`: Production-ready releases.
- `develop`: Integration branch for completed features.
- `feature/*`: Dedicated branches for individual features.
- `chore/*`: Dedicated branches for maintenance and migrations.

All pull requests are reviewed by CodeRabbit and subject to CI linting and automated test runs.
