# Architecture Overview

## Monorepo Structure

```
10Pearls_Project/
├── backend/          # Node.js + Express 5 + PostgreSQL (Prisma) REST API & Socket.io
├── frontend/         # React 19 + TypeScript + Vite + React Router Single Page Application
├── docs/             # Architecture, API, and setup documentation
├── .github/          # CI/CD workflows
├── package.json      # Central monorepo orchestration & unified npm scripts
├── README.md         # Comprehensive project documentation
└── sonar-project.properties # Quality analysis across frontend and backend
```

## Security & Communications
- **Cross-Origin Resource Sharing (CORS)**: Configured with `credentials: true`, restricted strictly to `FRONTEND_URL`.
- **CSRF Protection**: Origin and Referer validation on all mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`).
- **Session Security**: JWT stored in `HttpOnly`, `SameSite: Strict` cookies.
- **XSS Defense**: Strict DOMPurify whitelist on client side before rendering rich HTML note content.
- **Real-Time Sync**: Socket.io scoped to authenticated `userId` rooms.

