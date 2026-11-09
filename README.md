# Memoora - Unified Next.js Notes Application

## 1. Project Overview
Memoora is a production-grade full-stack personal notes application built as a **single, unified Next.js App Router application**. It consolidates the frontend user interface and backend REST API route handlers into one cohesive codebase powered by **Next.js 15**, **React 19**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 2. Architecture & Directory Structure

```
Memora/
├── app/                          # Next.js App Router (Pages, Layouts, & API Route Handlers)
│   ├── (auth)/                   # Route group for authentication
│   │   ├── login/page.tsx        # Login page
│   │   └── register/page.tsx     # Registration page
│   ├── api/                      # Backend API Route Handlers
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── login/route.ts    # POST /api/auth/login
│   │   │   ├── register/route.ts # POST /api/auth/register
│   │   │   ├── logout/route.ts   # POST /api/auth/logout
│   │   │   └── me/route.ts       # GET /api/auth/me
│   │   ├── health/route.ts       # GET /api/health
│   │   └── notes/                # Notes CRUD & batch operations
│   │       ├── route.ts          # GET /api/notes, POST /api/notes
│   │       ├── [id]/route.ts     # GET /api/notes/:id, PATCH, DELETE
│   │       └── import/route.ts   # POST /api/notes/import
│   ├── dashboard/page.tsx        # Authenticated Notes Dashboard (Live search, pin, export/import)
│   ├── globals.css               # Global styles, variables, typography
│   ├── layout.tsx                # Root HTML/Body layout with AuthProvider & Toaster
│   └── page.tsx                  # Public Landing Page & Features Showcase
│
├── components/                   # Reusable UI Components
│   ├── Modal.tsx                 # Accessible dialog modal
│   ├── Navbar.tsx                # Navigation bar with user status & theme
│   ├── NoteEditorModal.tsx       # Note creation and edit modal
│   ├── RichTextEditor.tsx        # Formatted text editor (Bold, italic, lists, undo)
│   └── UserProfileModal.tsx      # User profile detail & sign-out dialog
│
├── context/                      # Client-side React State Contexts
│   └── AuthContext.tsx           # Authentication state, session tracking & lifecycle
│
├── lib/                          # Core Server & Shared Libraries
│   ├── auth/                     # Authentication & security utilities
│   │   ├── auth.ts               # Cookie helpers, JWT verification & CSRF origin validator
│   │   ├── jwt.ts                # Token signing & verification
│   │   └── password.ts           # Bcrypt password hashing & comparison
│   ├── database/                 # Database clients
│   │   └── prisma.ts             # Server-only Prisma client singleton
│   ├── logger/                   # Structured logging
│   │   ├── logger.ts             # Pino logger instance
│   │   └── http-logger.ts        # Route handler HTTP request wrapper with duration tracking
│   ├── services/                 # Server-side business logic
│   │   ├── auth.service.ts       # User registration, authentication, & profile
│   │   └── notes.service.ts      # Multi-tenant notes CRUD & bulk import transactions
│   ├── utils/                    # Shared API helpers
│   │   └── api-error.ts          # Centralized error mapping (Prisma, Zod, AppError)
│   └── validations/              # Zod validation schemas
│       └── schemas.ts            # Input validation schemas for auth & notes
│
├── prisma/                       # Database Schema & Migrations
│   ├── migrations/               # PostgreSQL schema migration history
│   └── schema.prisma             # Prisma database schema definition
│
├── public/                       # Static Public Assets
│   ├── auth-visual.png           # Auth visual asset
│   ├── hero-visual.png           # Hero illustration
│   ├── favicon.svg               # Application favicon
│   ├── icons.svg                 # SVG sprite sheet
│   └── memoora-icon.svg          # Memoora logo mark
│
├── services/                     # Client-side API Service Layer
│   ├── api.ts                    # Axios client instance with 401 interceptor
│   ├── auth.service.ts           # Client auth API calls
│   └── notes.service.ts          # Client notes API calls
│
├── tests/                        # Comprehensive Test Suites
│   ├── backend/                  # Backend unit, integration, & security test suite
│   │   ├── api-handlers.test.ts  # Route handlers integration tests
│   │   ├── mock-request.ts       # NextRequest mock utility
│   │   └── unit.test.ts          # Password hashing, JWT, & Zod schema unit tests
│   └── frontend/                 # Frontend client logic & services test suite
│       ├── client-logic.test.ts  # DOMPurify sanitization, CSV export/import, note sorting
│       └── services.test.ts      # Auth & Notes client services tests
│
├── types/                        # TypeScript Type Definitions
│   ├── auth.types.ts             # User, Session, & Auth API types
│   └── notes.types.ts            # Note, CreateNoteData, & UpdateNoteData types
│
├── docs/                         # Architecture, Setup, and Migration Documentation
│   ├── api/                      # REST API endpoint specifications
│   ├── architecture/             # Architecture overview & security model
│   └── setup/                    # Setup & deployment guides
│
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript compiler configuration
├── package.json                  # Single root package configuration & scripts
└── sonar-project.properties      # SonarQube configuration
```

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Database & ORM**: PostgreSQL via Prisma ORM 6
- **Authentication**: JWT stored in `HttpOnly`, `SameSite: Strict` cookies
- **Security & CSRF**: Strict `Origin`/`Referer` validation on state-changing requests, sanitized rich-text with DOMPurify
- **Input Validation**: Zod runtime schema validation
- **Logging**: Pino structured JSON logger with HTTP request duration tracking
- **Testing**: Mocha, Chai, Tsx, JSDOM (41 automated test cases)
- **Linting & Type Safety**: Oxlint (instant static analysis) and TypeScript compiler (`tsc --noEmit`)

---

## 4. Getting Started

### Prerequisites
- **Node.js**: v18.18.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local instance or hosted provider (Supabase, Neon, Railway)

### Environment Setup
Create a `.env` file at the repository root based on `.env.example`:

```env
# Database Connection URL (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/memoora_db?schema=public"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:3000"

# JWT Authentication Secret
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_EXPIRES_IN="7d"

# Node Environment
NODE_ENV="development"
```

### Installation & Database Setup
```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npm run db:generate

# 3. Apply database schema migrations
npm run db:push
```

### Development
Start the unified Next.js development server:
```bash
npm run dev
```
The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 5. Available Scripts

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `next dev` | Starts the Next.js development server |
| `npm run build` | `next build` | Creates an optimized production build |
| `npm run start` | `next start` | Runs the built production server |
| `npm test` | `tsx node_modules/mocha/bin/mocha.js "tests/**/*.test.ts"` | Runs all 41 backend and frontend tests |
| `npm run test:backend` | `tsx ... "tests/backend/**/*.test.ts"` | Runs backend unit and route handler tests |
| `npm run test:frontend` | `tsx ... "tests/frontend/**/*.test.ts"` | Runs frontend services and client-logic tests |
| `npm run type-check` | `tsc --noEmit` | Runs full TypeScript static type checking |
| `npm run lint` | `oxlint app components lib services context types` | Runs fast Oxlint static analysis |
| `npm run db:generate` | `prisma generate` | Generates the Prisma Client |
| `npm run db:push` | `prisma db push` | Pushes the schema state to the database |
| `npm run db:migrate` | `prisma migrate dev` | Runs Prisma development migrations |
| `npm run db:studio` | `prisma studio` | Opens the interactive Prisma Studio database GUI |

---

## 6. REST API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new account (`name`, `email`, `password`)
- `POST /api/auth/login` — Sign in and receive `HttpOnly` JWT cookie (`email`, `password`)
- `POST /api/auth/logout` — Invalidate session and clear auth cookie
- `GET /api/auth/me` — Retrieve authenticated user profile

### Notes
- `GET /api/notes` — Retrieve all notes belonging to the authenticated user
- `POST /api/notes` — Create a new note (`title`, `content`)
- `GET /api/notes/:id` — Retrieve note by ID (strictly isolated to owner)
- `PATCH /api/notes/:id` — Update note title or content
- `DELETE /api/notes/:id` — Delete note by ID
- `POST /api/notes/import` — Bulk import notes within a single database transaction

### System
- `GET /api/health` — Application health check endpoint

---

## 7. Security Architecture

1. **HttpOnly Cookie Authentication**:
   - Authentication tokens are stored in secure, `HttpOnly`, `SameSite: Strict` cookies named `jwt`.
   - In production (`NODE_ENV=production`), `secure: true` is automatically enforced.
2. **CSRF Protection via Origin & Referer Validation**:
   - All state-changing route handlers (`POST`, `PATCH`, `DELETE`) validate `Origin` and `Referer` headers against the application host using `new URL().origin`. Cross-origin or missing origin requests are rejected with `403 Forbidden`.
3. **Multi-Tenant Data Isolation**:
   - Every database query for notes explicitly filters by `userId` extracted from the verified JWT payload. Users cannot read, modify, or delete another user's notes.
4. **Rich-Text HTML Sanitization**:
   - Note contents are sanitized with DOMPurify on display to eliminate XSS vectors (e.g. `<script>`, inline event handlers like `onerror`, `javascript:` URIs) while preserving safe styling tags (`<b>`, `<i>`, `<u>`, `<ul>`, `<ol>`, `<li>`, `<p>`).
5. **Database Error Redaction**:
   - Internal database connection errors or syntax exceptions are logged securely on the server with Pino and masked as generic `500 Internal Server Error` responses to prevent information leakage.
