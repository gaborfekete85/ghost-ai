# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Feature 02 (editor chrome) complete — awaiting review

## Current Goal

- None active. Last goal: Feature 02, spec in
  `context/feature-specs/02-editor.md`

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

## In Progress

- None.

## Next Up

- Feature 03 (see `context/feature-specs/`)

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
