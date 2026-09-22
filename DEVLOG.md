# Dev Log

Per-session development notes. Newest entry first. Release and version history lives in the README changelog, not here.

---

## Session 3 – 2026-09-22

### What I worked on
- Worked through the Session 2 CSS review list (1–6): removed redundant `button` margin; changed `.section-styles` from a plain flex row to `flex-wrap` + `flex-basis: 20rem`; scoped `button` to `.category-grid button` and shortened the border to shorthand; moved padding to `clamp()` (a mobile-first `min-width` media query was tried first, then replaced by `clamp()`); added global `box-sizing: border-box`; changed the grid column floor to `minmax(min(9rem, 100%), 1fr)`; switched `em`→`rem`; renamed `.section-styles`→`.list-section` and `.category-styles`→`.category-grid` (and updated `index.html` to match); moved each category's `<h3>` out of `.category-grid` so it's no longer a grid item.
- Follow-on layout request: grouped the seven categories into rows of three. Added a new `.category-list` class (mobile-first: 1 column, 3 columns at `min-width: 40rem`) applied only to the Shopping Item Selection `<section>`, kept independent from the shared `.list-section` class so the Grocery List section's layout isn't affected.
- Full accessibility pass (WCAG-adjacent, manual review, items #1–#7):
  1. Restored the Shopping section's accessible name via `aria-labelledby`/`id` (broken when `<h2>` was moved out of the section in Session 2).
  2. Wired the nav's placeholder links to real in-page targets (`#grocery-list`, `#accessibility-statement`) with `tabindex="-1"` on targets for reliable focus; left "Home" as a real link to `index.html`.
  3. Added a skip-to-main-content link (`<main id="main-content">`).
  4. Wrapped each category in `role="group"` + `aria-labelledby`, tied to a unique `id` on each `<h3>`.
  5. Converted each category's item buttons from `<div>`s to `<ul>`/`<li>` for list semantics; added `list-style: none; margin: 0;` to `.category-grid` to offset `<ul>` browser defaults.
  6. Added `id="grocery-list-items"` and `aria-live="polite"` to the (re-added) empty Grocery List `<div>`, prepping it for the v0.2.0 script.
  7. Bumped the footer's `Accessibility Statement` heading from `<h3>` to `<h2>` (top-level landmark, not a subsection).
- Also fixed the "Musili"→"Muesli" typo and shortened "Greek Yogurt"→"Yogurt" while converting Pantry/Dairy to list items.
- Discussed a full WCAG 2.2 AA audit; deferred — color contrast can't be meaningfully assessed before real colors are chosen, and no automated tooling was run.

### Files / components changed
- `index.html` — nav hrefs, skip link, `id`s/`aria-labelledby`/`role="group"`/`tabindex` throughout, `<ul>/<li>` conversion for all 7 categories, footer heading level, re-added Grocery List `<div>` with live-region attributes.
- `styles.css` — CSS review items 1–6, new `.category-list` class, `list-style`/`margin` reset for the new `<ul>`.

### Problems encountered and how they were resolved
- Several rounds of edits broke things and were caught by re-checking: a stray unmatched `<div>`/`</section>` split during the rename, mismatched selectors left pointing at old class names after a rename (dead CSS), a malformed multi-line CSS "comment" (`/** ... **/`) that an inner `/* */` closed early, leaving invalid trailing tokens, and a dangling `aria-labelledby` reference caused by a duplicated/misplaced closing `</section>` tag. All caught via re-reading the file (occasionally needing a direct disk read via Bash when the IDE buffer lagged behind a save) rather than trusting paste/description alone.

### Decisions and reasons
- Used `clamp()` over a `min-width` media query for padding (fluid scaling, no breakpoint to pick/maintain).
- Kept `.category-list` (3-column grouping) as a separate class from `.list-section` rather than modifying `.list-section` directly, to avoid coupling the Grocery List section's layout to the Shopping section's.
- Accessibility fixes were scoped to manual code review only — no automated tooling (axe/Pa11y/Lighthouse) run, consistent with the project's no-Node-tooling stance; a full WCAG 2.2 audit was offered but deferred by the user for a future session.

### Attempted / left unresolved
- Full WCAG 2.2 AA audit — deferred.
- Skip-link CSS (visually-hidden-until-focus styling) — HTML is in place, styling not yet written.
- Responsive design: the "Add Shopping Items" `<h2>` (`id="shopping-items-heading"`) is currently positioned incorrectly and needs to stack on top rather than its current layout.
- Nav menu isn't responsive yet — needs CSS work, with a hamburger menu (JS) planned for narrow screens eventually.
- v0.2.0 script (`script.js`, wiring item buttons to the Grocery List) still not started.

### Current state
- Static page, fully passed through this session's CSS and accessibility review lists. No JavaScript yet. Still `v0.1.0` (no version bump — no release, ongoing styling/accessibility work).

### Next step
Fix the responsive positioning of the "Add Shopping Items" heading (should stack above its section rather than its current placement), then move on to making the nav menu responsive (CSS first, hamburger menu via JS later).

---

## Session 2 – 2026-09-21

### What I worked on
- Started on responsive design and CSS. I first wrote a full mobile-first `styles.css` myself, then reverted it (see below); the user is writing the styles.
- The user's own CSS work: added `.section-styles` (flex row, border, padding), changed `.category-styles` to a CSS grid (`repeat(auto-fill, minmax(9rem, 1fr))`, `gap: 0.75rem`), added a global `button` rule (`width: 100%`, padding, margin).
- The user's HTML changes: added `class="section-styles"` to both `<section>`s, moved the "Add Shopping Items" `<h2>` out of its `<section>`, and moved each category `<h3>` inside its `.category-styles` div.
- Explained ways to make the item buttons a uniform size (grid, fixed flex basis, fixed width).
- Reviewed the user's CSS and listed improvements (next step).

### Files / components changed
- `styles.css` – user's new `.section-styles`, grid-based `.category-styles`, `button` rule.
- `index.html` – `section-styles` classes; `<h2>` and `<h3>` moved as described above.

### Problems encountered and how they were resolved
- I wrote a full `styles.css` when only asked to "add responsive design and styles". The user reverted it (`git checkout -- styles.css`) and set a rule: no styles from me. Recorded as a project memory rule.

### Decisions and reasons
- The user writes all CSS; I only explain and advise.
- No version bump or README changelog entry: styling is in progress and not a release.

### Attempted / left unresolved
- CSS is in progress; layout not yet checked at phone/tablet widths.
- Each category `<h3>` is now a grid item inside `.category-styles`, so it takes up one cell alongside the buttons.
- Carried over from Session 1: BOM in `README.md`, no `.gitattributes`, `index.html` cosmetics (stray space in `<div >`, "Musili", lorem ipsum footer, placeholder nav links).

### Current state
- Static page with partial styling; buttons still do nothing, the Grocery List `<div>` is still empty, no JavaScript. Still `v0.1.0`.

### Next step
Work through the CSS review:
1. `button`: remove `margin: 0.5em` (it overflows the grid cell and stacks with `gap`).
2. `.section-styles`: the flex row puts children side by side; use column, drop flex, or use `flex-wrap` with a `flex-basis`.
3. Scope `button` to `.category-styles button`; use `border: 1px solid blue` shorthand.
4. Reduce padding on phones (section 1.2em + category 2em + borders); raise it in a `min-width` media query or use `clamp()`.
5. Minor: global `box-sizing: border-box`, `minmax(min(9rem, 100%), 1fr)`, prefer `rem`, rename the `*-styles` classes.
6. Decide whether the category `<h3>` should span the full grid row (it's currently a grid item).

Then return to the v0.2.0 script: give the Grocery List `<div>` an `id` and add `script.js` so item buttons add to the list.

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
