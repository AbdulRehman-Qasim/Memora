# 10Pearls Shine Cohort 9 — MERN Notes Application
## Complete Project Context, Development Progress & Git Workflow

### 1. Project Overview

This project is part of the **10Pearls Shine Cohort 9 MERN development assignment**.

The goal is to build a complete full-stack **Notes Application** using a modern MERN-style architecture. The application allows authenticated users to create, view, edit, and delete their own notes while maintaining proper authentication, authorization, database integration, logging, exception handling, testing, and code-quality practices.

The project is being developed incrementally through separate feature branches and Pull Requests (PRs). Each feature is implemented, tested, reviewed, and then integrated into the `develop` branch.

The project is not being built as one large implementation. Instead, functionality is being developed feature-by-feature and phase-by-phase so that each module can be independently reviewed and integrated.

---

# 2. Required Technology Stack

The project requirements include:

- Node.js
- Express.js
- React.js
- PostgreSQL / MySQL
- Prisma ORM
- Pino Logger
- Mocha / Chai for backend testing
- Jest for frontend testing
- SonarQube for code-quality analysis
- Git / GitHub
- REST APIs

The actual project architecture has evolved around:

### Backend

- Node.js
- Express.js
- Prisma
- PostgreSQL
- Supabase
- JWT-based authentication
- bcrypt password hashing
- Express Validator
- Pino logging

### Frontend

- React 18
- Vite
- React Router
- Axios
- React Context API
- Vanilla CSS
- CSS variables
- Dark-mode capable styling

Redux is not being used because the current application does not require global state management beyond the existing authentication context and local component state.

---

# 3. Application Purpose

The application is a private notes-management system.

An authenticated user should be able to:

1. Create an account.
2. Log in.
3. Access a protected dashboard.
4. View their own notes.
5. Create new notes.
6. Edit existing notes.
7. Delete notes.
8. Use the note editor interface.
9. Log out.
10. Access user-related functionality where implemented.

Notes are associated with the authenticated user, meaning users should only be able to access and modify their own notes.

---

# 4. High-Level Application Architecture

The application is divided into two major parts:

```text
10Pearls MERN Notes Application
│
├── backend/
│   ├── Authentication
│   ├── Notes API
│   ├── Controllers
│   ├── Services
│   ├── Routes
│   ├── Validation
│   ├── Middleware
│   ├── Prisma
│   └── Database
│
└── frontend/
    ├── React Application
    ├── Routing
    ├── Authentication Context
    ├── API Services
    ├── Protected Routes
    ├── Dashboard
    ├── Notes UI
    ├── Login/Register
    └── Note Editor
```

The backend provides REST APIs while the React frontend consumes those APIs.

---

# 5. Database Architecture

The project uses **PostgreSQL through Supabase** with Prisma as the ORM.

The database schema includes the core entities required by the application, particularly:

### User

Stores authenticated user information.

### Note

Stores notes belonging to individual users.

The relationship is essentially:

```text
User
 │
 └── has many Notes

Note
 │
 └── belongs to one User
```

The Note model contains information such as:

- ID
- Title
- Content
- User ID
- Created timestamp
- Updated timestamp

Prisma was configured and validated during the database setup work.

A Supabase transaction pooler connection was used during the database setup process.

---

# 6. Git and Repository Strategy

The official 10Pearls branching strategy defines:

- `main` → production-ready code
- `develop` → latest development and integration branch

Feature branches are created separately for frontend and backend work.

The official branching document specifies:

```text
feature/frontend/<feature-name>
feature/backend/<feature-name>
```

and bug-fix branches follow:

```text
bugfix/frontend/<bug-description>
bugfix/backend/<bug-description>
```

The official workflow requires feature branches to be created from an updated `develop` branch, changes to be committed with descriptive messages, pushed to GitHub, and submitted through PRs targeting `develop`. At least one peer review is required before merging. 
---

# 7. Project-Specific Branch Workflow

The mentor has provided an additional workflow for situations where one feature depends on another feature that is still under review.

For a normal independent feature:

```bash
git checkout develop
git pull origin develop
git checkout -b feat-branch
```

For a feature that depends on another feature whose PR is still open:

```bash
git checkout feat1
git pull origin feat1
git checkout -b feat2
```

This allows development to continue without waiting for `feat1` to be merged.

Once `feat1` is merged into `develop`, `feat2` is rebased:

```bash
git checkout develop
git pull origin develop

git checkout feat2
git rebase develop
```

If conflicts occur:

```bash
git add <file>
git rebase --continue
```

If the rebase needs to be cancelled:

```bash
git rebase --abort
```

After rebasing, because the branch history has been rewritten:

```bash
git push origin feat2 --force-with-lease
```

`--force-with-lease` is preferred over plain `--force` because it provides protection against accidentally overwriting someone else's newer remote work.

---

# 8. Important Mentor Instruction

One of the most important project constraints is that development should remain understandable and genuinely owned by the student.

AI should be used as a **development assistant**, not as a mechanism for blindly generating code directly into the repository.

The code submitted to the project should be:

- understood by the developer,
- reviewed carefully,
- kept simple,
- consistent with the existing project,
- and written or refined by the developer.

Therefore, when using AI/Antigravity during this project, prompts are intentionally structured around:

1. Inspecting the existing implementation first.
2. Understanding the current architecture.
3. Making only necessary changes.
4. Avoiding unnecessary refactoring.
5. Keeping the implementation simple.
6. Preserving the existing coding style.
7. Verifying the result after implementation.

A recurring rule throughout this project is:

> If the current implementation already satisfies the requirement and no meaningful refinement is necessary, do not make unnecessary changes.

This is particularly important because the mentor has emphasized that completely AI-generated code can negatively affect evaluation.

---

# 9. Backend Development Progress

## Phase: Database Setup

A database setup feature was completed first.

The work included:

- Prisma setup.
- Prisma Client setup.
- `schema.prisma`.
- Prisma configuration.
- Database environment configuration.
- User model.
- Note model.
- PostgreSQL/Supabase integration.
- Prisma validation.
- Migration-related configuration and troubleshooting.

A Prisma client configuration issue was encountered during development and resolved by using the appropriate Prisma client generator.

The database layer became the foundation for the authentication and notes modules.

---

# 10. Authentication Module

A dedicated authentication feature was implemented.

### Authentication branch

```text
feature/authentication
```

The authentication module includes:

- User registration.
- User login.
- Password hashing using bcrypt.
- JWT utilities.
- Authentication validation.
- Authentication services.
- Authentication controllers.
- Authentication routes.
- Authentication middleware.
- Current-user retrieval.

The main authentication operations are:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Registration

The user provides registration information and the backend creates a new account.

Registration does not automatically log the user in.

### Login

Successful login authenticates the user and establishes the authenticated session.

### Current User

The `/api/auth/me` endpoint provides the currently authenticated user's information.

The authentication layer also protects resources that require an authenticated user.

---

# 11. Notes Backend Module

A dedicated notes feature was also developed.

### Branch

```text
feature/notes
```

The module was structured into separate layers:

```text
routes
   ↓
controllers
   ↓
services
   ↓
Prisma / database
```

Important files included:

```text
notes.service.js
notes.validation.js
notes.controller.js
notes.routes.js
```

The notes service implements CRUD operations.

The controller obtains the authenticated user's ID from:

```text
req.user.id
```

This is important because notes must be associated with the authenticated user rather than being treated as globally accessible records.

Validation was implemented using `express-validator`.

---

# 12. Backend Testing / Verification

The backend was run locally using the development server.

The server successfully started on port:

```text
5000
```

The health endpoint was verified successfully:

```text
GET /health
```

The response confirmed that the API was running.

Postman testing was also performed.

A note was successfully created with information including:

- note ID,
- title,
- content,
- user ID,
- created timestamp,
- updated timestamp.

The notes GET endpoint was also verified and returned the expected notes collection.

This confirmed connectivity between:

```text
Frontend / API Client
        ↓
Express Backend
        ↓
Authentication
        ↓
Prisma
        ↓
Supabase PostgreSQL
```

---

# 13. Frontend Authentication Development

After the backend authentication system was available, the frontend authentication flow was implemented.

### Branch

```text
feature/frontend-auth
```

The frontend uses:

- React
- Vite
- React Router
- Axios
- React Context

The frontend authentication implementation includes:

```text
AuthContext
auth.service
Axios API client
ProtectedRoute
PublicRoute
LoginPage
RegisterPage
DashboardPage
Navbar
MainLayout
HomePage
```

---

# 14. Frontend Routing Architecture

React Router is used to manage application navigation.

The application has public and protected areas.

### Public functionality

Examples include:

```text
/
login
register
```

### Protected functionality

The dashboard and authenticated note-management functionality are protected.

The application uses:

```text
ProtectedRoute
PublicRoute
```

to control access.

The user should not be able to access authenticated pages without a valid authenticated session.

---

# 15. Authentication Context

Authentication state is centralized through:

```text
AuthContext
```

The context exposes authentication-related information such as:

- current user,
- authentication state,
- authentication initialization.

The frontend does not manually handle JWT tokens through normal localStorage-based token management in the current architecture.

Authentication is driven by the application's session/cookie mechanism, while Axios handles authenticated API communication.

A global `401` response interceptor is used for authentication failure handling and automatic logout behavior.

---

# 16. Frontend Authentication Verification

The frontend authentication flow was tested end-to-end.

The following sequence was verified:

```text
Open application
      ↓
Register user
      ↓
User created successfully
      ↓
Login
      ↓
Authentication established
      ↓
Redirect to Dashboard
```

The verification included:

- Frontend loading.
- Navigation.
- Registration form rendering.
- Login form rendering.
- Form validation.
- Registration API request.
- User creation in the database.
- Login API request.
- Authentication state.
- Dashboard redirection.

The initial database connectivity test failed because Supabase was paused.

After Supabase was resumed, the complete authentication flow passed successfully.

---

# 17. Frontend Notes / Notes UI Integration

After the authentication functionality was completed, development moved to the next major feature:

## Frontend Notes / Notes UI Integration

The purpose of this feature is to connect the existing notes backend with the React frontend and build the actual notes-management experience.

This feature is being implemented incrementally rather than all at once.

The work has been divided into multiple phases.

---

# 18. Frontend Notes Architecture Inspection

Before writing code, the existing frontend architecture was inspected.

The inspection established that:

- React 18 is being used.
- Vite is the build tool.
- React Router is already present.
- Vanilla CSS is already used.
- CSS variables are used for consistent styling.
- Dark-mode styling already exists.
- Authentication is handled through `AuthContext`.
- Protected pages already use `ProtectedRoute`.
- Axios is already responsible for API communication.
- Authentication/session handling already exists.
- Redux is not currently required.

This inspection was important because the goal is to integrate notes into the existing application rather than introduce a new architecture.

---

# 19. Notes Types and Service Layer

The first implementation phase of the Notes UI integration introduced the frontend notes service/type structure.

Files include the notes-related type definitions and service layer.

The purpose is to keep API communication separate from UI components.

The architecture follows:

```text
React Component
      ↓
Notes Service
      ↓
Axios API Client
      ↓
Backend Notes API
      ↓
Prisma
      ↓
PostgreSQL
```

This keeps API-related logic out of individual UI components wherever possible.

---

# 20. Dashboard Integration

The Notes dashboard was then integrated with the notes service.

The dashboard is responsible for displaying the authenticated user's notes.

The expected flow is:

```text
Authenticated User
       ↓
Dashboard
       ↓
Fetch Notes
       ↓
Notes Service
       ↓
Backend API
       ↓
Database
       ↓
Return User's Notes
       ↓
Render Notes
```

The implementation respects the existing authentication architecture and does not introduce a second authentication/state-management system.

---

# 21. Create Note Functionality

The next phase added the ability to create a new note from the frontend.

The create-note flow is:

```text
Dashboard
   ↓
Create Note
   ↓
Note Editor
   ↓
Enter title/content
   ↓
Save
   ↓
Notes API
   ↓
Database
   ↓
Return to Dashboard
   ↓
Updated notes list
```

The implementation is intended to remain simple and consistent with the existing application rather than introducing unnecessary libraries or complex state management.

---

# 22. Current Frontend Notes Direction

The Notes UI is being built around four primary user-facing areas:

### Authentication

```text
Sign Up
Log In
Log Out
```

### Dashboard

```text
List Notes
Create Note
Open/Edit Note
Delete Note
```

### Note Editor

```text
Title
Content
Save
Cancel
```

### Optional Profile

```text
User Information
Logout
```

The current work is primarily focused on completing the core Notes UI experience.

---

# 23. Existing Frontend UI Architecture

The application currently follows a straightforward component architecture.

Conceptually:

```text
App
│
├── Public Routes
│   ├── Home
│   ├── Login
│   └── Register
│
└── Protected Routes
    │
    └── Main Layout
        │
        ├── Navbar
        │
        ├── Dashboard
        │   ├── Notes List
        │   └── Create Note
        │
        └── Note Editor
```

The goal is to keep the frontend understandable and maintainable without over-engineering it.

---

# 24. Project Development Philosophy

The project is being developed using an **inspect → implement → test → verify → commit → PR** workflow.

Before each new feature:

1. Inspect the current repository.
2. Understand the existing architecture.
3. Identify what is already implemented.
4. Avoid recreating existing functionality.
5. Implement only the missing requirement.
6. Test the implementation.
7. Review the actual changed files.
8. Confirm there are no unnecessary modifications.
9. Commit the changes.
10. Push the feature branch.
11. Create/update the PR.
12. Address review comments.
13. Merge into `develop`.

---

# 25. AI / Antigravity Usage in This Project

AI tools, including Antigravity, are being used as development assistants.

The process is deliberately structured so that AI first inspects the existing implementation before suggesting changes.

Typical instructions include:

- Do not modify files unnecessarily.
- Do not rewrite correct existing code.
- Follow the current architecture.
- Keep the implementation simple.
- Do not introduce unnecessary dependencies.
- Do not introduce unnecessary abstractions.
- Preserve existing styling conventions.
- Verify the actual files after implementation.
- Check existing functionality before adding anything.
- Make sure every generated/suggested change is understood and reviewed by the developer.

This is particularly important because the project is being evaluated as a development assignment, and the mentor explicitly expects students to understand and own the code they submit.

---

# 26. CodeRabbit / PR Review Workflow

Pull Requests are reviewed not only for whether the feature works, but also for code quality and architectural correctness.

CodeRabbit feedback has been used to identify issues that require additional review.

A key example from the authentication review involved logout behavior.

The expected logout flow was clarified so that:

```text
Call logout endpoint
        ↓
Clear local authentication state
```

rather than unnecessarily triggering authentication initialization again through logout-related state changes.

This demonstrates that PR review is being treated as part of the development process rather than simply merging code once it works.

---

# 27. Handling Existing Correct Code

An important project principle established during the work is:

> Correct existing code should not be changed merely because a new phase is being implemented.

For example, during later phases, existing pages and services were inspected carefully.

If an existing implementation already satisfies the requirement, the correct action is to leave it unchanged.

This reduces:

- unnecessary diffs,
- regression risk,
- architectural inconsistency,
- artificial complexity,
- and the appearance of automatically generated code.

---

# 28. Overall Current Architecture

At the current stage, the application can conceptually be represented as:

```text
                    React Frontend
                         │
              ┌──────────┴──────────┐
              │                     │
        Authentication          Notes UI
              │                     │
        AuthContext            Dashboard
              │                     │
       Protected Routes        Note Editor
              │                     │
              └──────────┬──────────┘
                         │
                       Axios
                         │
                    REST API
                         │
                Express Backend
                         │
          ┌──────────────┴──────────────┐
          │                             │
   Authentication                  Notes Module
          │                             │
   Controllers/Services         Controllers/Services
          │                             │
          └──────────────┬──────────────┘
                         │
                       Prisma
                         │
                    PostgreSQL
                         │
                      Supabase
```

---

# 29. Completed Work So Far

The project has progressed through the following major areas:

### Backend

- Database architecture established.
- Prisma configured.
- PostgreSQL/Supabase connected.
- User model established.
- Note model established.
- Authentication module implemented.
- Registration implemented.
- Login implemented.
- Current-user API implemented.
- JWT/authentication utilities implemented.
- Password hashing implemented.
- Authentication middleware implemented.
- Notes CRUD service implemented.
- Notes validation implemented.
- Notes controllers implemented.
- Notes routes implemented.
- Backend API locally tested.
- Database interaction verified.

### Frontend

- React/Vite application structure established.
- React Router integrated.
- Application layout established.
- Navbar established.
- Home page established.
- Login page established.
- Register page established.
- Authentication context implemented.
- API service layer implemented.
- Authentication service implemented.
- Protected routes implemented.
- Public routes implemented.
- Dashboard implemented.
- Authentication flow verified end-to-end.
- Notes types/service layer added.
- Notes dashboard integration completed.
- Create-note functionality added.
- Note-management UI integration is currently being continued.

---

# 30. Current Project Status

The project has moved beyond the initial setup stage.

The core foundation is already in place:

```text
Database
   ✓

Authentication Backend
   ✓

Notes Backend
   ✓

Frontend Authentication
   ✓

Protected Routing
   ✓

Dashboard
   ✓

Notes API Integration
   ✓

Notes Dashboard Integration
   ✓

Create Note
   ✓

Remaining Notes UI refinement/integration
   → In progress
```

The current focus is therefore **not** on rebuilding the foundation.

The current focus is on completing and polishing the Notes user experience while preserving the existing architecture.

---

# 31. How This Chat Is Being Used for the Project

This ChatGPT conversation is being used as a development-assistance and verification workspace for the project.

The workflow generally follows:

```text
Project Requirement
       ↓
Understand Existing Code
       ↓
Break Feature into Phases
       ↓
Create a Focused Implementation Prompt
       ↓
Implement Using Antigravity
       ↓
Inspect Actual Changes
       ↓
Run Tests / Verification
       ↓
Review CodeRabbit Feedback
       ↓
Fix Only Required Issues
       ↓
Commit
       ↓
Push
       ↓
PR Review
       ↓
Merge into develop
       ↓
Start Next Feature
```

The conversation is therefore not only about generating implementation instructions. It is also being used to:

- understand project requirements,
- decide the next feature,
- divide large features into manageable phases,
- inspect existing implementation,
- verify whether code actually satisfies requirements,
- interpret CodeRabbit feedback,
- troubleshoot Git workflows,
- manage dependent branches,
- verify frontend/backend integration,
- and prevent unnecessary changes.

---

# 32. Important Rules for Future Work

Any future work on this project should follow these rules:

### Rule 1 — Inspect First

Never assume that a feature is missing.

Always inspect the current implementation before making changes.

### Rule 2 — Do Not Rewrite Correct Code

If existing code already satisfies the requirement, keep it.

### Rule 3 — Keep Code Simple

The implementation should look like normal student/developer-written code and should match the existing project style.

### Rule 4 — Respect Existing Architecture

Do not introduce Redux, a new state-management architecture, a new styling framework, or unnecessary libraries unless the project genuinely requires them.

### Rule 5 — Maintain Separation of Concerns

Frontend UI, API services, backend controllers, services, validation, and database logic should remain appropriately separated.

### Rule 6 — Verify Actual Files

A phase should not be considered complete merely because an AI tool reports success.

The actual repository files and behavior must be inspected.

### Rule 7 — Test Before PR

Important functionality should be manually or automatically verified before creating/updating the PR.

### Rule 8 — Review PR Comments Carefully

CodeRabbit or mentor comments should be checked against the current code rather than blindly applying suggested changes.

### Rule 9 — Follow Git Dependency Workflow

If a new feature depends on an unmerged feature branch, branch from that feature branch. Once the parent feature is merged into `develop`, rebase the dependent branch onto the updated `develop`.

### Rule 10 — Use `--force-with-lease` After Rebase

Never casually use plain `--force` after rewriting a shared branch.

---

# 33. Final Project Summary

This project is a full-stack Notes Management Application being developed as part of the **10Pearls Shine Cohort 9 MERN assignment**.

The backend provides authentication and notes-management APIs backed by PostgreSQL/Supabase through Prisma. The frontend is a React/Vite application with routing, authentication context, protected routes, API services, dashboard functionality, and an evolving Notes UI.

The project is being developed feature-by-feature through Git branches and PRs targeting `develop`. The implementation process emphasizes clean architecture, simple code, testing, PR review, and avoiding unnecessary modifications.

The major backend foundation and authentication system are already established. The Notes backend is also implemented and tested. The frontend authentication flow is working end-to-end, and the frontend Notes integration has progressed through the notes service, dashboard integration, and create-note functionality.

The current development direction is to complete the remaining Notes UI functionality—particularly the full note-management experience—while preserving the existing architecture and avoiding unnecessary refactoring.

Most importantly, all future development should continue to follow the project's established principle:

**Understand the existing code first, implement only what is required, keep the code simple, verify the actual result, and ensure the developer understands every change that is submitted.**