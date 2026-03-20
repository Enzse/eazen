# IdeaOS (MVP) Plan

## Overview
IdeaOS is a personal idea and project tracking application built with **SvelteKit**. The MVP focuses on:
1. Capturing ideas and doing a quick single-score evaluation.
2. Prioritizing ideas using a computed `priority_score`.
3. Converting an idea into a project.
4. Managing tasks under each project.

Future-ready concepts (explicitly not part of MVP):
- Multiple evaluation history (`IdeaEvaluation`)
- Progress timeline (`ProgressUpdate`)
- AI assistance (Qwen via Ollama)
- PWA offline + installability

## MVP Decisions (Locked)
1. **Database**: `SQLite` via Prisma.
2. **Auth**: skipped for MVP (single-user app).
3. **Tags**: a single string field in the DB (comma-separated).
4. **Priority scoring**: computed and stored on create/update.

## Priority Scoring
Each idea has the numeric inputs:
- `interest` (1–10)
- `learning_value` (1–10)
- `income_potential` (1–10)
- `effort` (1–10)

Formula:
```text
priority_score = (interest + learning_value + income_potential) - effort
```
Range (given inputs 1–10):
- min: 1 + 1 + 1 - 10 = -7
- max: 10 + 10 + 10 - 1 = 29

### Priority Color Thresholds (MVP)
Used in UI for “high/medium/low” labeling:
- `high` (red): `priority_score >= 18`
- `medium` (yellow): `10 <= priority_score <= 17`
- `low` (green): `priority_score <= 9`

Note: thresholds are intentionally simple for MVP and can be tweaked later without changing the scoring formula.

## Data Model (MVP)
### Idea
Represents a raw concept plus quick evaluation.
Fields:
- `id` (Int, PK, autoincrement)
- `title` (String)
- `description` (String)
- `category` (String)
- `tags` (String; comma-separated)
- `stage` (String: `captured | selected | archived`)
- `interest` (Int)
- `learning_value` (Int)
- `income_potential` (Int)
- `effort` (Int)
- `priority_score` (Int; computed and stored)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Project
Execution layer created from an idea.
Fields:
- `id` (Int, PK, autoincrement)
- `ideaId` (Int, unique 1:1 with Idea)
- `name` (String; default = idea title)
- `status` (String: `planned | active | paused | completed`)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Task
Actionable steps under a project.
Fields:
- `id` (Int, PK, autoincrement)
- `projectId` (Int)
- `title` (String)
- `description` (String? optional)
- `status` (String: `todo | doing | done`)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `completedAt` (DateTime? optional)

### Prisma Notes
- `Idea.project` is optional because conversion happens later.
- Keep schema extensible by aligning field naming with future tables (`IdeaEvaluation`, `ProgressUpdate`) even though they’re not added now.

## Routes (MVP)
- `/app/dashboard`
  - Top 3 ideas by `priority_score`
  - Active projects (empty at first; filled in Phase 3)
  - Task summary counts (`todo / doing / done`)
- `/app/ideas`
  - List + filters (`category`, `stage`)
  - Sort by `priority_score` and `createdAt`
- `/app/ideas/new`
  - Create idea
- `/app/ideas/[id]`
  - Idea detail
  - Score display + breakdown
  - “Convert to Project” button if no project exists yet
- `/app/projects`
  - List projects
- `/app/projects/[id]`
  - Project detail
  - Task CRUD (list + create + update + complete)

## Backend Strategy (SvelteKit-native)
For MVP we will use:
- `load()` for data fetching (read operations).
- Server actions for mutations:
  - Idea create/update/delete
  - Convert idea -> project
  - Task create/update/delete (and status transitions)

This keeps implementation simple while remaining extensible.

## Components (MVP)
- `IdeaForm.svelte` (create/edit idea)
- `ScoreDisplay.svelte` (shows breakdown + total + color)
- `IdeaCard.svelte` (used in lists + dashboard top 3)
- `ProjectCard.svelte` (used in project list/dashboard)
- `TaskList.svelte` (project task list view)
- `TaskItem.svelte` (single task row/card)

## Development Phases

### Phase 1: Setup + Idea CRUD + scoring
Setup tasks:
- Install/configure Prisma with SQLite.
- Create Prisma schema and migrate.

Implementation:
- `Idea` model + migrations.
- Server actions for:
  - create/update/delete Idea
  - recompute `priority_score` on create/update
- Routes:
  - `/app/ideas/new`
  - `/app/ideas/[id]`

Acceptance criteria:
- Creating an idea stores the correct computed `priority_score`.
- Editing an idea recomputes and stores `priority_score`.
- Idea detail page shows title/description/category/stage/tags + score breakdown.

### Phase 2: Idea list + dashboard
Implementation:
- `/app/ideas`:
  - filters: `category`, `stage`
  - sorting: `priority_score` then `createdAt`
- `/app/dashboard`:
  - top 3 ideas by `priority_score`
  - active projects (initially empty)
  - task summary (initially empty)

Acceptance criteria:
- Filtering/sorting behaves deterministically.
- Top 3 ideas match stored `priority_score`.

### Phase 3: Projects + tasks
Implementation:
- Add Prisma models for `Project` and `Task`.
- Implement conversion:
  - “Convert to Project” on idea detail
  - creates `Project` with:
    - `name = idea.title`
    - `status = planned`
    - 1:1 relation to `Idea` via `ideaId`
- Routes:
  - `/app/projects`
  - `/app/projects/[id]`
- Task CRUD within project detail:
  - create task
  - update task fields and status
  - mark done sets `completedAt` (if enabled)

Acceptance criteria:
- Conversion creates exactly one project per idea.
- Task CRUD works and persists to SQLite.
- Project detail shows tasks with correct status counts.

### Phase 4: UI polish + UX
Implementation:
- Apply priority colors consistently (idea cards + lists).
- Improve forms:
  - validation + user-friendly error messages
  - friendly empty states for ideas/projects/tasks
- UX improvements:
  - better sorting UI cues
  - responsive layout tweaks

Acceptance criteria:
- Core workflows are smooth and visually consistent.

### Phase 5: Post-MVP (planned only)
No code yet for MVP.
- `IdeaEvaluation`:
  - replace “single score” with evaluation history UI later
- `ProgressUpdate` timeline
- AI assistant (Qwen via Ollama)
- PWA:
  - installability (manifest/icons)
  - offline caching of pages + key data reads
  - later: safe handling for offline mutations + sync

## Non-goals for MVP
- No authentication/authorization.
- No multi-evaluation history.
- No progress timeline.
- No AI assistance.
- No PWA offline behavior (added later).

## Implementation Principles
- Build working MVP quickly; iterate after.
- Avoid overengineering now; keep architecture extensible.
- Keep scoring logic centralized and reused across UI and backend.
- Keep Prisma schema aligned with future expansions (naming/relations) without implementing them yet.

