# API Documentation

All API routes are prefixed with `/api`.

## Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Authenticate user & issue HttpOnly JWT cookie | No |
| `POST` | `/api/auth/logout` | Clear JWT cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes |

## Notes Endpoints (`/api/notes`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/notes` | List all notes for authenticated user | Yes |
| `GET` | `/api/notes/:id` | Fetch specific note by ID | Yes |
| `POST` | `/api/notes` | Create a new note (`title`, `content`) | Yes |
| `PATCH` | `/api/notes/:id` | Update note by ID (`title`, `content`) | Yes |
| `DELETE` | `/api/notes/:id` | Delete note by ID | Yes |
| `POST` | `/api/notes/import` | Bulk import notes array (`[{ title, content }]`) | Yes |

## Health Check

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Health check endpoint returning `{ status: "UP" }` | No |

