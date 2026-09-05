# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

LeaveEasy — a Thai-language online leave-request prototype built for a course lab (ADT-RAISE Non-Degree Batch 2 · Module 2, weeks 6–9). This repo is a student's fork of `cnacha-mfu/leaveeasy-start`, worked on solo. **[leaveeasy-spec.md](leaveeasy-spec.md) is the authoritative spec** — read it before implementing anything non-trivial; if a summary of it doesn't match reality, fix the doc first, don't start building.

Two hard rules baked into the spec that apply to any AI working in this repo (spec §0.1, §8, §9):
- **Do not add unspecified features**, even ones that seem obviously needed.
- **Do not implement a future week's work early.** The weekly roadmap (spec §8) is a strict gate — going further breaks the course's grading checkpoints. Section §9 lists things explicitly out of scope for the whole module (no frameworks, no custom server, no SQL, no pagination, no email/LINE notifications, no leave-balance calculation, no multi-language/dark mode, etc.).

## Commands

```bash
npm install     # installs devDependency `serve`
npm run dev     # serve -l 3000 .  — open http://localhost:3000
```

No build step, no linter, no test suite (automated testing is explicitly out of scope until week 9 — spec §8). This is plain HTML/CSS/JS with no bundler; opening the `.html` files directly also works for pages that don't touch Firestore.

## Non-negotiable technical constraints (spec §0.2)

- Plain HTML/CSS/JS only — **no framework** (React/Vue/Next.js/Tailwind/etc.) and no bundler.
- One `.html` file per screen. Shared styles in `css/style.css`, shared behavior in `js/`.
- **No custom backend** — pages talk to Firestore directly from the browser.
- Firestore starts week 6; Firebase Authentication + Hosting + minimal security rules start week 7; per-role security rules + AI assist button start week 8; automated testing starts week 9.
- All on-screen text is Thai. File names and Firestore field names are English, exact casing (spec §5: `status` ≠ `Status`, silently breaks things).

## Architecture

### Shared includes and script load order

Every page loads scripts `defer`, in this order:
1. `js/util.js` — helpers used everywhere: `esc()` (HTML-escape), `ป้ายสถานะ()` (status badge HTML), `เวลาตอนนี้()` (current timestamp in the seed-data format), `ค่าจากURL()` (read a query param).
2. `js/nav.js` — builds the top nav bar into `<div id="nav">` from one array (`เมนู`) inside the IIFE; edit that array to change the menu on every page at once. Also defines `showConfigWarning()`, used when Firebase isn't reachable.
3. *(only on pages that read Firestore)* the Firebase compat SDK from CDN (`firebase-app-compat.js`, `firebase-firestore-compat.js`, pinned to v10.13.0) then `js/firebase-config.js`, which calls `firebase.initializeApp()` and exposes a global `db`. Compat (script-tag) SDK is used deliberately, not the module build, so files can still be opened by double-click.
4. *(on pages still using fake data)* `js/data.js` — exposes `window.LEAVE_DATA` (`users`, `leaveTypes`, `leaveRequests`, `approvals`) with field names matching Firestore exactly, so the same shapes move to Firestore later without renaming.
5. The page's own script, e.g. `js/leave-requests.js`.

Identifiers are intentionally bilingual: JS variable/function names and HTML element `id`s are Thai (`กล่องใบลา`, `ป้ายสถานะ`, `ค่าจากURL`), while Firestore field names and file names are English per the spec's naming rules — keep following this split when editing.

### Per-page data source — mixed migration state, check before assuming

This is the one thing that's easy to get wrong: **not all pages read the same way**, because the course migrates one page at a time.

| Page | Data source | Notes |
|---|---|---|
| `leave-requests.html` | **Live Firestore read** (`db.collection("leaveRequests").get()`) | Week 6's one required read; merges in anything just submitted via `sessionStorage` under key `ใบลาที่ยื่นใหม่`. Supports `?status=<ค่า>` to pre-filter (used by dashboard stat links). |
| `new-leave-request.html`, `leave-request-detail.html`, `leave-types.html` | **In-memory only** — reads `window.LEAVE_DATA` from `js/data.js`; writes go to `sessionStorage` or local arrays, nothing persists to Firestore | Wiring these to real Firestore writes (create/update/delete) is week 7 scope — don't do it early. |
| `dashboard.html` | **`js/data.js`** (not Firestore) | Deliberately a static shell per spec §4 page 5 — "หน้าโครงจาก prototype ตลอด Module 2"; real counts wait for Module 3. |

### Firestore data model (spec §5)

Collections (flat, camelCase, no underscores): `users`, `leaveTypes`, `leaveRequests` (with a `approvals` **subcollection** nested under each leave request document). No relational tables, no JOIN — cross-references are stored as an id field *and* a denormalized name field on the same document (e.g. `leaveRequests.requesterId` + `requesterName`, `.approverId` + `approverName`, `.leaveTypeId` + `leaveTypeName`; `approvals.authorId` + `authorName`). When adding a field that references another collection, add its "Name" twin too — see spec §5.3 for the full rationale and the accepted staleness tradeoff (renaming a user does not retroactively update old requests).

Status is a 3-value state machine (spec §6): `รอพิจารณา` → `อนุมัติ` | `ไม่อนุมัติ`, both terminal, no reverting. A transition to `ไม่อนุมัติ` requires at least one `approvals` entry to already exist. Only `manager`/`hr` roles may change status (not yet enforced in code — that lands with security rules in week 8).

### Firebase project

`js/firebase-config.js` hardcodes the web config for the Firebase project `leaveeasy-songchai` (apiKey etc. are safe to expose client-side per Firebase's own model — this is not a secret). Firestore is currently in test mode with a 30-day expiry set at project creation; week 7 replaces this with real security rules.

**Never commit a real secret key/token into any file that gets pushed** — this is different from the Firebase web config above. It matters starting week 8, when the AI assist button needs an OpenRouter API key: that key must stay out of tracked files (e.g. read from a gitignored config or entered at runtime), not hardcoded like `firebase-config.js`.

## Current progress vs. the week 6–9 roadmap (spec §8)

Week 6 (screens + read-only Firestore) is done: all 5 screens plus the `index.html` landing page exist and link to each other, Firestore is seeded, `leave-requests.html` reads live. Week 7 (`CRUD` for the other three pages, Firebase Auth, minimal "must be logged in" security rule, Firebase Hosting deploy, and this file) has not been started yet — do not jump ahead into week 8/9 items (per-role rules, AI assist button, Playwright testing) until that's done.
