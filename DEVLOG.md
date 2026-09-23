# Dev Log

Per-session development notes. Newest entry first. Release and version history lives in the README changelog, not here.

---

## Session 5 – 2026-09-23

### What I worked on
- Discussed and scoped the long-term product architecture: custom item entry (textbox + category → persistent button), recipes (bulk-add a named item group to the grocery list), and eventual login, built on PHP + MySQL.
- Decided per-user data scope (custom items/categories/recipes are private per account, not shared) and a Docker Compose local dev stack (PHP+Apache, MySQL, phpMyAdmin) — deferred login/item-form/recipe UI to future sessions.
- Built the backend foundation: `docker-compose.yml` (web/db/phpmyadmin services), `docker/php/Dockerfile` (`php:8.3-apache` + `pdo_mysql`/`mysqli`), `.env`/`.env.example` for DB credentials, `db/init/001_schema.sql` (six tables: `users`, `categories`, `items`, `recipes`, `recipe_items`, `grocery_list_items`, all per-user via `user_id` FKs, plus a placeholder dev user), and `api/health.php` (PDO connectivity check).
- Added a "Running locally" section to `README.md` documenting the Docker workflow and the three local URLs.
- Verified the full stack: built and started containers, confirmed the static site still renders unchanged at `:8080`, confirmed `/api/health.php` returns a healthy DB connection with the correct table count, confirmed schema + placeholder user via phpMyAdmin/CLI, and confirmed data persists across a `down`/`up` restart (without `-v`).
- Generated a real bcrypt hash for the placeholder dev user's password via the running `web` container (`docker compose exec web php -r "..."`) and updated both the live row and `db/init/001_schema.sql` so a fresh volume seeds a valid hash too.

### Files / components changed
- New: `docker-compose.yml`, `docker/php/Dockerfile`, `db/init/001_schema.sql`, `api/health.php`, `.env` (gitignored), `.env.example`.
- `README.md` — added Docker "Running locally" instructions and updated the Files list.

### Problems encountered and how they were resolved
- MySQL init failed on `grocery_list_items`: a `CHECK (item_id IS NOT NULL OR free_text_name IS NOT NULL)` constraint referencing `item_id` isn't allowed alongside that column's `ON DELETE SET NULL` foreign key action (MySQL error 3823). Dropped the CHECK constraint; that "at least one of the two must be set" rule will need to be enforced in the API layer instead of at the DB level.
- First `docker compose up` attempt happened before Docker Desktop was running; resumed once confirmed started. Generating the placeholder dev user's bcrypt hash initially failed too, for the same underlying reason — running `php -r` against the host shell doesn't work since PHP isn't installed on Windows itself, only inside the container. Fixed by running it through the container instead: `docker compose exec web php -r "..."`.

### Decisions and reasons
- Per-user data scope for items/categories/recipes, even before login exists — avoids a later migration from shared/global to per-user data, and login only needs to add an auth endpoint against the already-existing `users` table.
- `user_id` columns are `NOT NULL` (not nullable) with a placeholder dev user (`id = 1`) rather than nullable FKs — nullable-to-NOT-NULL migrations are painful once real data exists; this way ownership is correct and enforced from day one.
- Chose Docker Compose over XAMPP/MAMP or a bare PHP built-in server, per user preference — fully isolated and reproducible, easy to tear down/rebuild.
- Kept `index.html`/`styles.css`/`script.js` at the repo root rather than moving them under a `public/` folder — the PHP container just mounts the repo root as its docroot, so the existing static site needed zero changes.
- Deferred the item-form/recipe UI and login endpoints to future sessions, and deprioritized the long-pending pure-JS "v0.2.0" (wiring category buttons to the grocery list) — that work will likely move to a PHP-backed flow once the backend lands, rather than being built twice.

### Attempted / left unresolved
- No login/auth endpoints yet (table exists, no code).
- No custom-item-entry form or API wiring yet.
- No recipe creation/application UI or API wiring yet.
- Nav color contrast fix and hamburger tap-target size verification from Session 4 — contrast was fixed (confirmed: nav background now `rgb(237, 236, 206)`), but tap-target size still hasn't been explicitly checked.
- `script.js` v0.2.0 (wiring category buttons to the grocery list) — still not started as originally scoped; will likely be redesigned as a PHP-backed flow instead.

### Current state
- Static frontend unchanged and still fully functional standalone. New Docker Compose backend (PHP 8.3 + Apache, MySQL 8.4, phpMyAdmin) runs alongside it, verified working end-to-end: site loads, DB connects, schema (6 tables) is correctly initialized, and data persists across restarts. No frontend code yet talks to the backend.

### Next step
Verify the hamburger tap-target size (carried over from Session 4), then start wiring the frontend to the backend — likely beginning with the custom-item-entry form (textbox + category picker) and its API endpoint, since that unblocks testing the per-user items/categories tables end-to-end.

---

## Session 4 – 2026-09-22

### What I worked on
- Fixed the "Add Shopping Items" heading (`#shopping-items-heading`) sitting inside the `.category-list` grid as a regular grid item, causing it to share a row with the Produce/Meat groups at ≥40rem instead of spanning full width above them. Added `grid-column: 1 / -1;` to force it onto its own full-width row regardless of column count.
- Built the full responsive nav menu:
  - Added a hamburger `<button id="nav-toggle">` with `aria-expanded`/`aria-controls`/`aria-label="Menu"`, wrapping the three nav links in `<div id="nav-links">`; caught and removed a duplicate leftover `<nav>` block from the initial markup pass.
  - `script.js` toggle logic: click listener toggles `.nav-open` on `#nav-links` and syncs `aria-expanded`.
  - Mobile-first CSS: `#nav-links` hidden by default, shown via `.nav-open`; `@media (min-width: 40rem)` override hides the toggle button and shows links inline as a row.
  - Styled the nav bar (`body > nav` flex row, centered, padding, background) and link padding.
  - Right-aligned the hamburger button at narrow widths via `margin-left: auto` (outside the media query, since the button is hidden at desktop anyway).
  - Converted the mobile menu into a full-width dropdown: `flex-wrap: wrap` on `body > nav` + `flex-basis: 100%` on `#nav-links.nav-open`, so the link list drops to its own full-width row below the fixed-position button.
  - Fixed a specificity edge case: added a same-specificity `#nav-links.nav-open` override inside the `40rem` media query (`flex-direction: row; flex-basis: auto;`) so the desktop layout wins even if `.nav-open` is still applied when the viewport is widened.
  - `script.js`: added a `matchMedia('(min-width: 40rem)')` change listener to force-close the menu (remove `.nav-open`, reset `aria-expanded`) when the viewport crosses into desktop width, so it can't reappear "stuck open" if later narrowed again.
  - `script.js`: added click-outside-to-close and Escape-to-close (with focus returned to the toggle button), plus a Tab/Shift+Tab focus trap confining keyboard focus to the toggle button + links while the menu is open.
- Discussed and deferred the skip-link's visual styling — decided to leave it as a plain, unstyled, always-visible top-left link (it's already first in the DOM, so no positioning CSS is needed either way) rather than the usual hidden-until-focus pattern.
- Manual accessibility pass on the new nav work and a general recheck:
  - Found and fixed: `#grocery-list` section was missing an accessible landmark name (no `aria-labelledby`), inconsistent with the Shopping Item Selection section from Session 3 — added `id="grocery-list-heading"` + matching `aria-labelledby`.
  - Found and flagged (not yet fixed): nav background (`gray`) vs. default browser link blue gives ~2.4:1 contrast, failing WCAG AA's 4.5:1 requirement for normal text.
  - Flagged for manual verification (not yet checked): whether `#nav-toggle`'s actual rendered hit area meets the 24×24px minimum target size (WCAG 2.2 SC 2.5.8).
  - Confirmed no regressions: focus outlines untouched, all 7 category `role="group"`/`aria-labelledby` pairs still correct, `aria-expanded`/`aria-controls` stay synced through every JS code path.

### Files / components changed
- `index.html` — hamburger button + nav-links wrapper markup, removed duplicate `<nav>`, added `aria-labelledby`/`id` to the Grocery List section.
- `styles.css` — `#shopping-items-heading` grid-column fix, full mobile-nav rule set (`#nav-links`, `#nav-links.nav-open`, `#nav-toggle`, `body > nav`, `nav a`, and the `40rem` media-query overrides).
- `script.js` — created from empty; nav toggle, desktop-breakpoint auto-close, outside-click close, Escape close, and Tab focus trap.

### Problems encountered and how they were resolved
- Repeatedly placed new nav CSS rules in the wrong scope relative to the `40rem` media query (mobile-first default vs. desktop override), most notably duplicating a conflicting `display` declaration on `#nav-links` and, separately, moving `#nav-toggle`'s `display: none` fully outside the media query (hiding the button at all widths, making the menu briefly unreachable) instead of adding a *separate* `margin-left: auto` rule alongside it. Each was caught by re-reading the file directly off disk and walking through the cascade/specificity explicitly before the next attempt.
- Diagnosed (via manual grid auto-placement trace) that the heading's mislayout wasn't a positioning issue but a grid auto-flow issue — the `<h2>` was being auto-placed as an ordinary grid item alongside the category groups at ≥40rem.
- Identified a real specificity conflict: `#nav-links.nav-open` (id+class) outranked the media query's plain `#nav-links` rule, so a menu left open while resizing past the breakpoint stayed in the mobile layout. Fixed by adding a matching-specificity override inside the media query.

### Decisions and reasons
- Used `margin-left: auto` (not a `justify-content` change) to right-align the hamburger button — scoped to exactly the element that needs it, and has no effect once the button is hidden at desktop, so no override was needed elsewhere.
- Used `flex-wrap` + `flex-basis: 100%` (not `position: absolute`) to make the mobile menu a full-width dropdown — keeps it in normal document flow, pushing page content down rather than overlaying it.
- Handled the "menu left open across a resize" edge case with a same-specificity CSS override inside the media query, rather than a JS resize listener alone — the desktop layout is guaranteed correct immediately via CSS regardless of JS timing; JS is still used separately to *reset the actual open/closed state* (`.nav-open` class + `aria-expanded`) so it doesn't resurface incorrectly if narrowed again later.
- Chose a plain, unstyled, always-visible skip-link over the usual hide-until-focus pattern — since it's already first in the DOM and renders top-left with zero CSS, adding offscreen/focus-toggle CSS was judged unnecessary complexity for no visible benefit right now.
- Full WCAG 2.2 AA audit remains deferred (color contrast still can't be fully assessed without a finished color scheme) — but the nav's new `gray` background was audited on its own since it's an actual color decision made this session, and it failed outright.

### Attempted / left unresolved
- Nav contrast fix (gray background / default link blue) — identified, not yet fixed.
- Hamburger button minimum tap-target size (24×24px) — flagged for manual verification, not yet checked.
- Full WCAG 2.2 AA audit — still deferred.
- `script.js` v0.2.0 (wiring category item buttons to the Grocery List) — still not started; this session's `script.js` work was entirely nav-menu behavior.

### Current state
- Static page with a fully functional, accessible responsive nav (toggle, mobile-first CSS, right-alignment, full-width dropdown, resize-reset, outside-click/Escape close, focus trap). No grocery-list functionality yet. Still `v0.1.0`.

### Next step
Fix the nav color contrast issue (gray background vs. default link blue, currently ~2.4:1), verify the hamburger button's tap-target size meets the 24×24px minimum (WCAG 2.2 SC 2.5.8), then move on to `script.js` v0.2.0 — wiring the category item buttons to add items into `#grocery-list-items`.

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
