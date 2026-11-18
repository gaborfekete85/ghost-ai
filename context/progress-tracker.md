# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Feature 09 (share dialog) implemented; browser check of 04/06/07/08/09 pending

## Current Goal

- Feature 09: Share dialog (invite / list / remove collaborators, copy link). Spec in `context/feature-specs/09-share-dialog.md`

## Completed

- Next.js boilerplate cleanup (globals.css reduced to the
  Tailwind import, template SVGs removed, minimal home page).
- Hydration warning guard: `suppressHydrationWarning` on `<html>`
  (browser extensions inject attributes before hydration).
- Feature 01: shadcn/ui configured (`components.json`), generated
  `components/ui/{button,card,dialog,input,tabs,textarea,scroll-area}.tsx`
  (unmodified), `lucide-react` installed, `libs/utils.ts` with `cn()`,
  dark-only theme tokens in `app/globals.css`, `dark` class on `<html>`.
  Verified: tsc + eslint clean, `bun run build` passes, `cn()` merges
  conflicting classes, and every primitive renders dark in a
  production build (no light styling).

- Feature 02: `components/editor/editor-navbar.tsx` (h-12, left/center/right, `PanelLeftOpen/Close` toggle, props `isSidebarOpen` + `onToggleSidebar`), `project-sidebar.tsx` (fixed overlay, slides from left, `isOpen`, header + close, shadcn Tabs My Projects/Shared with empty states, full-width New Project button), `editor-dialog.tsx` (title, description, body, footer; color tokens). tsc (excluding stale `.next/types`) + eslint clean. Mounted globally: `components/editor/editor-shell.tsx` (client; owns sidebar open state) wraps `{children}` in `app/layout.tsx`. Verified in Chrome: sidebar overlays without pushing content, no console errors.

- Feature 03: `@clerk/nextjs` + `@clerk/ui` installed (bun). `ClerkProvider` wraps root layout with `libs/clerk-appearance.ts` (Clerk `dark` theme + app CSS variables, no hex). `proxy.ts` at root: public = sign-in/sign-up env paths, everything else `auth.protect()`. Pages `app/sign-in/[[...sign-in]]`, `app/sign-up/[[...sign-up]]` using `components/auth/auth-layout.tsx` (two-panel on lg, form only on small). `/` redirects to `/editor` or `/sign-in`. `UserButton` in editor navbar right section. `EditorShell` moved from root layout to `app/editor/layout.tsx` (so auth pages have no editor chrome); placeholder `app/editor/page.tsx`. `bun run build` passes; signed-out curl: `/` and `/editor` redirect to sign-in, auth pages 200.

- Feature 03 restyle (per `context/feature-asset/auth.jpg`): auth layout is now 50/50 on lg; left panel uses `bg-bg-surface` against the `bg-bg-base` right side, with headline, description, icon+title+description feature list and footer. Body uses `font-sans` (Geist via `--font-sans`; Clerk uses the same). Removed `new Date()` from the footer, which broke prerendering under Cache Components.

- Feature 04: `libs/projects.ts` (Project type, `slugify`, mock data), `components/editor/use-project-dialogs.ts` (dialog/form/loading state, in-memory create/rename/delete with simulated delay), `project-dialogs.tsx` (Create with live slug preview, Rename prefilled + autofocus + Enter submits, Delete destructive confirm), `editor-home.tsx` (heading, description, New Project button) via `editor-actions-context.tsx`. Sidebar lists mock projects; rename/delete icons only on owned projects; mobile backdrop scrim closes sidebar. tsc + eslint clean. NOT yet verified in browser (needs sign-in).

- Feature 05: downgraded CLI to Prisma 7 (`prisma@7.10.1`, matches `@prisma/client`); removed the v8 RC scaffold (`src/prisma`, v8 `prisma.config.ts`, `prisma-8.md`, `@prisma/orm-postgres`, `@prisma/cli-engine`). Added `prisma/schema.prisma` (generator `prisma-client` -> `generated/prisma`, gitignored + eslint-ignored), `prisma/models/project.prisma` (`ProjectStatus`, `Project`, `ProjectCollaborator` with cascade, unique project/email, required indexes), `prisma.config.ts` (loads `.env.local`, schema dir `prisma`), `lib/prisma.ts` (cached singleton on `globalThis`; `prisma+postgres://` -> Accelerate, else `@prisma/adapter-pg` honoring `?schema=`). Installed `@prisma/extension-accelerate` (needed for the Accelerate branch). Migration SQL generated at `prisma/migrations/20261118200534_init` (via `migrate diff`, since `migrate dev` needs a shadow DB). `prisma generate` + `bun run build` pass.

- Feature 06: `app/api/projects/route.ts` (GET list own projects newest first; POST create, name defaults to `Untitled Project`, cuid id from schema) and `app/api/projects/[projectId]/route.ts` (PATCH rename, DELETE; 401 unauthenticated, 404 missing, 403 non-owner, 400 empty/invalid name). Helpers in `libs/api.ts`. `proxy.ts` now lets `/api/*` through because Clerk's `auth.protect()` returns 404 for unauthenticated API calls; handlers enforce auth and return 401. `lib/prisma.ts` now typed as `PrismaClient` (union type from the Accelerate branch broke call signatures). tsc, eslint, `bun run build` pass; unauthenticated GET/POST/PATCH/DELETE verified 401 on a prod server. Authenticated paths (200/201/403/404) NOT exercised: the Feature 05 migration is not applied, so tables don't exist yet.

- Feature 07: `libs/projects-data.ts` (server-only `getProjects()`: owned + shared via `ProjectCollaborator` email match, case-insensitive) replaces mock data; `app/editor/layout.tsx` fetches server-side inside `<Suspense>` (required by Cache Components) and passes `projects` to `EditorShell` -> sidebar (fetched in the layout, not the page, because the sidebar is mounted by the layout and shared with workspace pages). New `hooks/use-project-actions.ts` replaces `components/editor/use-project-dialogs.ts` (deleted): create (name input, 6-char suffix, `createRoomId` = slug + suffix, POST, `router.push('/editor/<id>')`), rename (prefilled, PATCH, refresh), delete (DELETE, redirect to `/editor` if the active workspace else refresh), with error display in dialogs. Create dialog shows Room ID preview; rename dialog has no slug preview. Project ID === Liveblocks room ID: `POST /api/projects` now accepts an optional validated `id` (lowercase slug, <=100 chars; 409 on duplicate). Added a placeholder `app/editor/[projectId]/page.tsx` (404 if not accessible) so create has somewhere to navigate. `Project` type is now `{id, name, isOwner}`. tsc, eslint, `bun run build` pass. NOT exercised against the DB or in a browser (migration unapplied, sign-in needed).

- Feature 05 migration applied to `ghost` (RDS). Removed `CREATE SCHEMA` from `20261118200534_init` (needs DB-level CREATE even with IF NOT EXISTS; the schema is pre-created), marked the first failed attempt rolled back, redeployed. Verified in the DB: tables `Project`, `ProjectCollaborator`, enum `ProjectStatus`, all columns, 4 indexes + unique(projectId,email), FK with ON DELETE CASCADE. `lib/prisma.ts` now enables SSL for non-local hosts: the pg adapter sent no SSL and RDS answered P1010 `no pg_hba.conf entry ... no encryption`. (Superseded: SSL now verifies certs against the pinned `certs/rds-global-bundle.pem` for `*.rds.amazonaws.com`, system CAs for other remote hosts.) Runtime smoke test via the singleton: create project + collaborator, cascade delete OK (test rows removed).
- Fixed: created projects didn't show in the sidebar (layout isn't re-rendered on `router.push`); create now also calls `router.refresh()` like rename/delete. Needs browser confirmation.
- Fixed: delete of the open workspace left a stale sidebar (`router.push` alone). Create and delete-of-active now use `navigateAndRefresh` (push + refresh in one `startTransition`); API create/rename/delete also call `revalidatePath('/editor','layout')`. Needs browser confirmation.
- Feature 08: `lib/project-access.ts` (`getIdentity()` = Clerk userId + primary email; `getAccessibleProject(id, identity)` = owner OR collaborator by email, case-insensitive; missing and forbidden both return null). `app/editor/[roomId]/page.tsx` (server component, renamed from `[projectId]`): signed out -> `redirect('/sign-in')`; no access or nonexistent -> `components/editor/access-denied.tsx` (centered, lock icon, message, link to `/editor`); else `components/editor/workspace-shell.tsx` (client, full-viewport `h-dvh`: navbar with project name + Share button + AI sidebar toggle, existing `ProjectSidebar` with current room highlighted, central dark canvas placeholder, right AI sidebar placeholder; Share has no behavior). To give the workspace its own chrome, the old `app/editor/layout.tsx` + `page.tsx` moved into route group `app/editor/(home)/` (URLs unchanged). `EditorNavbar` gained optional `title` + `actions`; `ProjectSidebar` gained `currentRoomId` and its project names are now `<Link>`s to `/editor/<id>` (previously not navigable). `libs/projects-data.ts` reuses `getIdentity()`. tsc, eslint, `bun run build` pass; access query verified against the DB (owner, collaborator case-insensitive, stranger, no-email stranger, missing) with temporary rows. Not exercised in a signed-in browser. Stale `.next/dev/types` broke the build after the route move; deleting that generated dir fixed it.
- Feature 09: APIs `GET/POST /api/projects/[projectId]/collaborators` (GET: owner or collaborator, returns `role` + list; POST: owner only, email trimmed+lowercased+validated, 400 invalid/own email, 409 duplicate) and `DELETE .../collaborators/[collaboratorId]` (owner only, scoped to the project, 404 if not found). Statuses: 401 signed out, 404 missing project, 403 no access / not owner. `lib/project-access.ts` gained `getProjectRole()` (owner | collaborator | null; distinguishes missing vs forbidden). `lib/collaborators.ts` (server-only) enriches emails via Clerk Backend API `users.getUserList({emailAddress})` with display name + avatar (`hasImage` only), email-only fallback, best-effort (errors are logged, list still returns). No local user table. UI: `components/editor/share-dialog.tsx` (built on `EditorDialog`; owners get invite form + remove buttons, collaborators a read-only list; avatar with initial fallback; Copy link -> `Copied!` for 2s; list fetched each time it opens) opened from the navbar Share button in `workspace-shell.tsx`. tsc, eslint, `bun run build` pass. Verified against the DB with the Clerk identity mocked (18 checks: 401/404/400/409/403/201/204, collaborator read-only, cross-project delete blocked) and a real Clerk lookup for a nonexistent email (falls back to email only). NOT verified in a signed-in browser; real name/avatar enrichment for an existing Clerk user not exercised.
- Verify Features 04/06/07/08/09 end-to-end in a signed-in browser (sidebar list, create -> navigate, rename, delete).

## Next Up

- Browser verification above; then the next feature spec.

## Open Questions

- RESOLVED: `app/globals.css` now has the real palette tokens (`bg-bg-*`, `border-border-*`, `text-text-*`); Feature 02 uses them.
- (old) The spec says to match "the existing dark theme in global.css",
  but `app/globals.css` contains no theme (only the Tailwind
  import) and `ui-context.md` is still an empty template.
  Interim decision: dark-only theme using shadcn's neutral dark
  tokens in `app/globals.css`. Confirm or supply real palette.
- The spec names `libs/utils.ts` (shadcn defaults to `lib/`).
  Following the spec: `libs/utils.ts`, alias `@/libs/utils`.
- Two lockfiles now exist (`package-lock.json` from the template,
  `bun.lock` from bun). `package-lock.json` is stale; decide which
  one to keep (project rule is bun).

- Feature 03 spec said Clerk was installed with sign-in/up env vars; actually `@clerk/nextjs` was missing and `.env.local` had only the two keys. Installed `@clerk/nextjs`, and added Clerk's standard `NEXT_PUBLIC_CLERK_SIGN_IN_URL`, `..._SIGN_UP_URL` and the two `..._FALLBACK_REDIRECT_URL` vars (=/editor) to `.env.local`. Needs the same vars on any deploy env.

- `.env.local` `DATABASE_URL` must use `?schema=ghost` (Prisma param); `currentSchema=` is ignored by Prisma and falls back to `public`.

## Architecture Decisions

- shadcn/ui components live in `components/ui/` and are never
  edited after generation (protected files). Theming is done
  through CSS variables in `app/globals.css` only.
- shadcn CLI 4.23 generates `import { cn } from "cn"` and did not
  rewrite it to the utils alias. Instead of editing generated files,
  `tsconfig.json` maps `"cn"` to `./libs/utils.ts`. Do NOT install
  the unrelated npm package `cn`. If a future CLI emits
  `@/libs/utils`, the mapping can be removed.

## Session Notes

- `globals.css` had the shadcn `@theme inline` block commented out (broke the build: unknown utility `border-border`). Restored it; the new palette tokens block is kept alongside.
- Interceptor CLI is not installed; verified with the claude-in-chrome tools instead.

- `bunx tsc --noEmit` reports stale errors from `.next/types` (deleted `app/ds-check`); clears after `bun dev`/build regenerates types.

- Dev server runs on port 3001 (Docker holds 3000). It served stale
  CSS after `next build` ran alongside it; restart `bun dev` after
  this feature. Avoid running `next build` while dev is running.
- Project rules: use bun/bunx (not npm/npx).
- Context files other than this one are still templates.
