# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Feature 04 (project dialogs) in progress; Feature 03 (auth) awaiting review

## Current Goal

- Feature 04: editor home + create/rename/delete project dialogs + sidebar actions (mock data only). Spec in
  `context/feature-specs/04-project-dialogs.md`

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

## In Progress

- None (Feature 04 awaiting review).

## Next Up

- Feature 05 (see `context/feature-specs/`)

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
