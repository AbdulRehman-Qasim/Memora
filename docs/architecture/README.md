# Architecture Overview

## Unified Next.js Application Structure

```
Memora/
├── app/                  # Next.js App Router (Pages, Layouts, & API Route Handlers)
│   ├── (auth)/           # Authentication route group (login, register)
│   ├── api/              # Serverless API Route Handlers (auth, notes, health)
│   ├── dashboard/        # Authenticated Notes Workspace
│   └── page.tsx          # Public Landing Page & Features
├── components/           # Reusable Accessible UI Components
├── context/              # Client State Management (AuthContext)
├── lib/                  # Server-side Utilities, Services, & Validation
├── prisma/               # Database Schema & Migrations
├── public/               # Static Assets
├── services/             # Client Axios API Layer
├── tests/                # Automated Backend & Frontend Tests
├── types/                # TypeScript Type Definitions
├── package.json          # Root orchestration & scripts
├── README.md             # Project documentation
└── sonar-project.properties # SonarQube code quality configuration
```

## Security & Communications
- **Origin & CSRF Protection**: Origin and Referer validation on all mutating requests (`POST`, `PATCH`, `DELETE`).
- **Session Security**: JWT stored in `HttpOnly`, `SameSite: Strict` cookies (`jwt`).
- **Data Isolation**: Strict multi-tenant isolation where note operations filter by `userId` from the authenticated session.
- **XSS Defense**: DOMPurify HTML sanitization applied on client render.
- **Structured Logging**: Pino structured JSON logger with HTTP request duration tracking.
