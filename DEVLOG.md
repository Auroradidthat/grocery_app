# Dev Log

Per-session development notes. Newest entry first. Release and version history lives in the README changelog, not here.

---

## Session 1 – 2026-09-19 → 2026-09-20

### What I worked on
- Set up the repo: `git init` on `main`, added `.gitignore` and `README.md`.
- Fixed the Dairy section in `index.html` (missing closing `</div>`, duplicated Dairy buttons). Verified afterwards: 45 opening / 45 closing `<div>`, 2/2 `<section>`.
- Connected to https://github.com/Auroradidthat/grocery_app and got the first commit onto remote `main`.
- Added a changelog to the README and introduced versioning (SemVer, `0.x`); tagged and pushed `v0.1.0`.
- Corrected a stale changelog line about `curriculum_files/` (that folder doesn't belong to this project).
- Added this `DEVLOG.md` and a `CLAUDE.md` describing the session routine.
- Pushed `DEVLOG.md` and `CLAUDE.md` (`c232941`) and verified the remote: only `main` and the `v0.1.0` tag are on GitHub.
- Deleted the local `dev` and `release` branches.

### Files / components changed
- `index.html` – grocery list page: nav, header, empty Grocery List section, item buttons by category (Produce, Meat, Dairy, Pantry, Desserts, Cleaning Supplies, Dental Hygiene), footer accessibility statement.
- `styles.css` – now only `.category-styles` (flex row); replaced the remote's starter pastry-card styles.
- `README.md` – description, run instructions, file list, changelog.
- `.gitignore` – kept the remote's version and added `.env.*`, `npm-debug.log*`, `*.swp`, `build/`.
- `DEVLOG.md`, `CLAUDE.md` – new.

### Problems encountered and how they were resolved
- **First push rejected.** The remote already had an "Initial commit" (`curriculum_files/` plus starter `.gitignore`, `index.html`, `styles.css`). Fetched and inspected it, then rebased my commit on top: kept my `index.html` and `styles.css`, merged the two `.gitignore` files.
- **Commit landed on the wrong branch.** The repo was on a `dev` branch I hadn't noticed, so the changelog commit and the `v0.1.0` tag went to `dev` and `git push origin main` reported "Everything up-to-date". Resolved by merging `dev` into `main` and pushing with `--follow-tags`.
- **Remote changed mid-session.** `curriculum_files/` and the old `README.md` were deleted on GitHub, so merging `dev` gave a modify/delete conflict on `README.md`. Kept our README.
- **Wrong branch again at session end.** `HEAD` was on `release` (`dev` and `release` had been fast-forwarded to `main`'s commit). Switched to `main` and deleted both branches. `CLAUDE.md` now says to check the branch before committing.

### Decisions and reasons
- Rebase, not force-push, to preserve the remote's existing history.
- SemVer starting at `v0.1.0` (first working page); `0.x` signals initial development. Patch for fixes, minor for features, `1.0.0` when ready for real use.
- README changelog = release/version history; DEVLOG = per-session notes. Kept separate on purpose.
- Docs-only fixes don't bump the version.
- No `package.json` / `npm version`; not worth Node tooling for a plain HTML/CSS project.

### Attempted / left unresolved
- `README.md` was created with a UTF-8 byte-order mark (PowerShell `Set-Content -Encoding utf8`); harmless, not stripped.
- Git warns about LF→CRLF conversion; no `.gitattributes` added.
- `index.html` cosmetic issues left as-is: stray space in `<div >` (Meat, Beef), "Musili" likely meant "Muesli", footer accessibility statement is lorem ipsum, nav links are `href="#"` placeholders.

### Current state
- `v0.1.0` tagged and pushed; `main` is the only branch and matches `origin/main`.
- Static page only: item buttons do nothing, the Grocery List section is an empty `<div>`, no JavaScript yet.

### Next step
Start v0.2.0: add a script (e.g. `script.js`, linked from `index.html`) so clicking an item button adds that item to the Grocery List section. First give the empty `<div>` in the Grocery List section an `id` to target.
