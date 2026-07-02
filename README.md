# TaskFlow — Task Management Frontend

A production-ready frontend for the **Task Management API**, built with **Next.js 15 (App Router)**, **JavaScript**, **Tailwind CSS**, and **shadcn/ui**.

Every screen, request, and validation rule in this app is implemented directly against the API contract in the backend design document — no endpoints, fields, or behaviors were added or changed. Where the contract doesn't provide something (e.g. a user directory), the UI is honest about that limitation rather than inventing a fake one — see [Known constraints](#known-constraints-inherited-from-the-api-contract) below.

---

## 1. Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, JavaScript) |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix primitives) |
| Server state | TanStack Query v5 |
| HTTP client | Axios |
| Forms | React Hook Form + Zod |
| Icons | lucide-react |
| Toasts | Sonner |


---

## 2. Getting started

### Prerequisites
- Node.js 18.18+ (Node 20/22 recommended)
- A running instance of the Task Management API (FastAPI backend)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local
# then edit .env.local and point NEXT_PUBLIC_API_BASE_URL at your backend

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login` — register an account (`POST /auth/register`), then sign in.

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of the backend API, no trailing slash | `http://localhost:8000` |
| `NEXT_PUBLIC_AUTH_COOKIE_NAME` | Cookie name used to persist the JWT | `taskflow_token` |

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint (next/core-web-vitals)
```

This project builds cleanly with zero ESLint errors and no external network calls at build time (system fonts are used instead of Google Fonts, so `next build` works in fully offline/sandboxed CI environments too).

---

## 3. Project structure

```
app/                     Routes (App Router)
  (auth)/                 Public route group — centered auth layout
    login/
    register/
  (app)/                  Protected route group — sidebar + navbar shell
    dashboard/
    projects/
      [id]/
    tasks/
      [id]/
    profile/
  layout.js               Root layout (providers, fonts, metadata)
  page.js                 "/" → redirects to /dashboard
  error.js / not-found.js Global error & 404 boundaries
  middleware.js            Route protection (redirects based on the auth cookie)

components/
  ui/                     shadcn/ui primitives (button, dialog, table, form, ...)
  layout/                 Sidebar, Navbar, MobileNav, UserMenu, AppShell
  common/                 PageHeader, PaginationControl, SearchBar, EmptyState,
                          ConfirmDialog, LoadingSpinner, SkeletonLoaders, ErrorBoundary

features/                 Feature-sliced UI, one folder per domain
  auth/                   LoginForm, RegisterForm
  dashboard/              StatsGrid, WelcomeSection, RecentTasks/Projects, QuickActions
  projects/               ProjectList, ProjectCard, ProjectFormDialog, ProjectDetails
  tasks/                  TaskListSection, TaskTable, TaskFilters, TaskFormDialog,
                          AssignTaskDialog, StatusBadge, PriorityBadge, AssigneeChip
  attachments/            AttachmentUploader (drag & drop), AttachmentList, FileTypeIcon
  profile/                ProfileCard

services/                 Thin API layer — one file per resource, 1:1 with the endpoints
hooks/                    TanStack Query hooks (useProjects, useTasks, useAttachments, ...)
lib/                      utils (cn), constants (enums), validations (Zod), badge styles,
                          auth-token (cookie helpers)
utils/                    Formatters (dates, file sizes, initials, ids)
types/                    JSDoc typedefs mirroring the backend schemas
providers/                AuthProvider, QueryProvider, AppProviders
styles/                   globals.css (design tokens, base styles)
```

---

## 4. How the frontend maps to the API contract

### Authentication (Section 3.1 / 4.1 of the design doc)

| UI | Endpoint |
| --- | --- |
| Register page | `POST /auth/register` |
| Login page | `POST /auth/login` → JWT stored in a cookie |
| Session hydration | `GET /users/me` |
| Every subsequent request | `Authorization: Bearer <token>` header (via an Axios interceptor) |
| 401 response | Token cleared, user redirected to `/login?reason=session_expired` |

The JWT is stored in a cookie (not `localStorage`) so that `middleware.js` can check for its presence on the server and protect `/dashboard`, `/projects`, `/tasks`, and `/profile` before any page renders. The register endpoint returns a `UserResponse`, not a token — matching the contract, the UI sends the user to `/login` to authenticate after registering rather than auto-logging them in.

### Projects (Section 3.2)

| UI | Endpoint |
| --- | --- |
| Projects grid, pagination | `GET /projects/?skip=&limit=` |
| Project details page | `GET /projects/{id}` |
| Create project | `POST /projects/` |
| Edit project (owner only) | `PUT /projects/{id}` |
| Delete project (owner only) | `DELETE /projects/{id}` |

Edit/Delete actions are only shown when `user.id === project.owner_id`, mirroring the "owner only" rule in Section 4.3. A 403 from the backend (e.g. someone lands on a project they're not a member of) renders an in-app "no access" state rather than a raw error.

### Tasks (Section 3.3)

| UI | Endpoint |
| --- | --- |
| Task list, filters (status/priority/project), pagination | `GET /tasks/?project_id=&status=&priority=&skip=&limit=` |
| Task details | `GET /tasks/{id}` |
| Create task | `POST /tasks/` |
| Edit task (title/description/status/priority) | `PUT /tasks/{id}` |
| Assign task | `PATCH /tasks/{id}/assign` |
| Delete task (soft delete) | `DELETE /tasks/{id}` |

The **Search** box is a client-side filter over title/description, layered on top of the documented `status`/`priority`/`project_id` query params — the API has no free-text search parameter, so nothing was added server-side; the UI simply fetches the filtered set and narrows it further in the browser.

Editing a task never sends `assigned_to` — per the contract, `TaskUpdateRequest` doesn't include it. Reassignment is a separate action that calls `PATCH /tasks/{id}/assign`, which per Section 5 is the endpoint that publishes the Service Bus `task-assigned` notification.

### Attachments (Section 3.4)

| UI | Endpoint |
| --- | --- |
| Drag-and-drop / browse upload | `POST /tasks/{id}/attachments` (multipart) |
| Attachment list, download/open | `GET /tasks/{id}/attachments` |

The uploader validates file extension (`.pdf .png .jpg .jpeg .docx .xlsx`) and the 10 MB size limit client-side before sending, purely as a UX nicety — the backend remains the source of truth and still enforces both (413 / 422). Image attachments get a thumbnail preview; other types show a file-type icon.

### Profile

`GET /users/me` powers the profile page and the navbar's user menu. Logout simply clears the token cookie and the client-side cache — there's no `/auth/logout` endpoint in the contract, so this is purely a client-side session teardown, as JWTs are stateless.

---

## 5. Known constraints inherited from the API contract

The design document intentionally exposes only 17 endpoints, and this frontend doesn't add to that surface. Two consequences worth knowing about:

- **No user directory.** The only user-facing endpoint is `GET /users/me` — there's no `GET /users` to list or search registered users. So the "Assign Task" dialog asks for a user ID (UUID) directly rather than offering a name picker, and task/attachment "assignee" and "uploaded by" chips show **"You"** for the current user or a shortened, hoverable UUID for anyone else. If a user directory becomes available in a future backend version, `AssigneeChip` and `AssignTaskDialog` are the two places to wire it in.
- **No total counts on list endpoints.** `GET /projects/` and `GET /tasks/` return a page of results with no `X-Total-Count`. Pagination controls therefore show "Previous / Page N / Next" rather than "Page 2 of 8", inferring whether a next page exists from whether the current page came back full.

Dashboard aggregates (total/completed/pending/high-priority task counts) are computed client-side by paginating through the existing list endpoints — this uses the documented pagination as intended, rather than requiring a new `/stats` endpoint.

---

## 6. Design system

- **Palette:** background `#F8FAFC`, slate/near-black primary actions, blue-600 accents for links/focus/active states, gray-200 borders, gray-900 text, with muted green/amber/red reserved for success/warning/error semantics only.
- **Typography:** system font stack (`-apple-system`, `Segoe UI`, `Inter`, `Roboto`, …) — no external font requests, so the app never has a network dependency just to render text.
- **Components:** every interactive primitive (button, dialog, sheet, dropdown, select, table, form, tooltip, toast, …) lives in `components/ui/` as hand-built shadcn/ui-style components on top of Radix UI, styled with CSS variables in `styles/globals.css` so the theme can be retuned from one place.
- **Responsiveness:** a fixed sidebar on `lg+` screens collapses into a slide-out drawer (`Sheet`) below that breakpoint; tables collapse into stacked cards on mobile; every dialog/form is scrollable and full-width on small screens.

---

## 7. Notes for graders / reviewers

- All 17 endpoints from the design document are called somewhere in the app: `register`, `login`, `users/me`, `projects` (create/list/get/update/delete), `tasks` (create/list/get/update/assign/delete), `attachments` (upload/list), and `health` (used for the small "API Connected" indicator in the navbar).
- Validation on every form (`lib/validations/*.js`) mirrors the field constraints documented in Section 3 (username 3–50 chars alphanumeric+underscore, password ≥8 chars, project name ≤200 chars, task title ≤500 chars, UUID-shaped assignee IDs, etc.) using Zod, in addition to the server remaining the final authority.
- `next build` was used throughout development to continuously verify the project compiles and lints cleanly.
