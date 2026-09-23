# Dev Log

Per-session development notes. Newest entry first. Release and version history lives in the README changelog, not here.

---

## Session 5 – 2026-09-23

### What I worked on
- Discussed and scoped the long-term product architecture: custom item entry (textbox + category → persistent button), recipes (bulk-add a named item group to the grocery list), and eventual login, built on PHP (a server-side programming language) + MySQL (a database).
- Decided per-user data scope (custom items/categories/recipes are private per account, not shared) and a Docker Compose local dev stack (Docker Compose: a tool that starts several containers — isolated, reproducible app environments — together with one command; here PHP+Apache [Apache: the web server software that actually receives and serves page requests], MySQL, phpMyAdmin) — deferred login/item-form/recipe UI to future sessions.
- Built the backend foundation: `docker-compose.yml` (web/db/phpmyadmin services), `docker/php/Dockerfile` (the recipe for building the PHP container: `php:8.3-apache` + `pdo_mysql`/`mysqli`, the extensions PHP needs to talk to MySQL), `.env`/`.env.example` for DB credentials, `db/init/001_schema.sql` (the database's table structure: six tables — `users`, `categories`, `items`, `recipes`, `recipe_items`, `grocery_list_items`, all per-user via `user_id` FKs [foreign keys — columns that link a row to another table's row, here tying data to its owning user], plus a placeholder dev user), and `api/health.php` (a PDO [PHP's standard library for connecting to a database] connectivity check).
- Added a "Running locally" section to `README.md` documenting the Docker workflow and the three local URLs.
- Verified the full stack: built and started containers, confirmed the static site still renders unchanged at `:8080`, confirmed `/api/health.php` returns a healthy DB connection with the correct table count, confirmed schema + placeholder user via phpMyAdmin/CLI (CLI = command-line interface — running commands by typing them, instead of clicking through a GUI), and confirmed data persists across a `down`/`up` restart (without `-v`).
- Generated a real bcrypt hash (bcrypt: a one-way scrambling algorithm for storing passwords — the original password can't be recovered from the hash) for the placeholder dev user's password via the running `web` container (`docker compose exec web php -r "..."`) and updated both the live row and `db/init/001_schema.sql` so a fresh volume (Docker's persistent storage for the database's data, separate from the container itself) seeds a valid hash too.
- Verified the hamburger button's tap-target size (carried over from Session 4): forced its `display` on via JS to measure it at the width the desktop media query would otherwise hide it, since resizing the actual browser window didn't change `window.innerWidth` in this environment. Rendered box is ~27.9×34.5 CSS px — passes the 24×24px WCAG 2.2 SC 2.5.8 minimum with no CSS changes needed.
- Made the GitHub repo (`Auroradidthat/grocery_app`) private, then pushed this session's work.
- Security follow-up after the push: rotated the placeholder dev user's password hash so it corresponds to a random value that was generated and immediately discarded (never displayed or recorded) instead of a known string, and stopped `api/health.php` from echoing exception details to the client on failure (now logs server-side via `error_log` and returns a generic error response).

### Files / components changed
- New: `docker-compose.yml`, `docker/php/Dockerfile`, `db/init/001_schema.sql`, `api/health.php`, `.env` (gitignored), `.env.example`.
- `README.md` — added Docker "Running locally" instructions and updated the Files list.

### Problems encountered and how they were resolved
- MySQL init failed on `grocery_list_items`: a `CHECK (item_id IS NOT NULL OR free_text_name IS NOT NULL)` constraint (a database rule that rejects a row if it doesn't meet a condition) referencing `item_id` isn't allowed alongside that column's `ON DELETE SET NULL` foreign key action (a rule that blanks out a reference instead of blocking the delete when the row it points to is removed) — MySQL error 3823. Dropped the CHECK constraint; that "at least one of the two must be set" rule will need to be enforced in the API layer instead of at the DB level.
- First `docker compose up` attempt happened before Docker Desktop was running; resumed once confirmed started. Generating the placeholder dev user's bcrypt hash initially failed too, for the same underlying reason — running `php -r` against the host shell doesn't work since PHP isn't installed on Windows itself, only inside the container. Fixed by running it through the container instead: `docker compose exec web php -r "..."`.

### Decisions and reasons
- Per-user data scope for items/categories/recipes, even before login exists — avoids a later migration from shared/global to per-user data, and login only needs to add an auth endpoint against the already-existing `users` table.
- `user_id` columns are `NOT NULL` (the database refuses to save a row without a value there) with a placeholder dev user (`id = 1`) rather than allowing empty/nullable values — going back and changing a column from nullable to `NOT NULL` later is painful once real data exists; this way ownership is correct and enforced from day one.
- Chose Docker Compose over XAMPP/MAMP or a bare PHP built-in server, per user preference — fully isolated and reproducible, easy to tear down/rebuild.
- Kept `index.html`/`styles.css`/`script.js` at the repo root rather than moving them under a `public/` folder — the PHP container just mounts the repo root as its docroot, so the existing static site needed zero changes.
- Deferred the item-form/recipe UI and login endpoints to future sessions, and deprioritized the long-pending pure-JS "v0.2.0" (wiring category buttons to the grocery list) — that work will likely move to a PHP-backed flow once the backend lands, rather than being built twice.
- Repo made private on GitHub before the first push of this backend work, given the schema/seed data involved; treated as a stopgap alongside (not a substitute for) fixing the actual issues (known placeholder password, verbose error output) — both were fixed the same session rather than left "safe because private."

### Security
- Placeholder dev user's password hash rotated to correspond to a random, generated-and-discarded value (never displayed or recorded), replacing an earlier known string — nobody knows this password, by design.
- `api/health.php` stopped echoing exception details (the technical error message from a crash — potentially useful to an attacker) to the client on DB-connection failure; now logs server-side via `error_log` (PHP's built-in way to write a message to a log file instead of the page) and returns a generic error response instead.
- `.env` (real DB credentials) confirmed gitignored (excluded from git, so it never gets committed/pushed) and never committed; `.env.example` holds only placeholder values.
- `user_id` columns made `NOT NULL` from day one, so per-user data ownership is enforced at the schema level rather than retrofitted later.
- Repo made private on GitHub as an additional stopgap, not a substitute for the fixes above.
- Reviewed for public-facing docs afterward: confirmed no real secrets/hashes-of-known-values appear in README/DEVLOG/CLAUDE.md.

### Accessibility
- Verified the hamburger button's tap-target size (the clickable/tappable area — needs to be big enough for someone with limited motor precision, or on a touchscreen, to hit reliably) (carried over from Session 4): forced `display` on via JS to measure it at the width the desktop media query would otherwise hide it. Rendered box ~27.9×34.5 CSS px — passes the WCAG 2.2 SC 2.5.8 (WCAG: Web Content Accessibility Guidelines, the standard rulebook for accessible websites; SC 2.5.8 is the specific rule number for minimum tap-target size) 24×24px minimum with no CSS changes needed.

### Attempted / left unresolved
- No login/auth endpoints yet (table exists, no code).
- No custom-item-entry form or API wiring yet.
- No recipe creation/application UI or API wiring yet.
- `script.js` v0.2.0 (wiring category buttons to the grocery list) — still not started as originally scoped; will likely be redesigned as a PHP-backed flow instead.
- Footer's Accessibility Statement is still lorem ipsum — flagged unresolved back in Session 1 and not resurfaced since, despite four sessions of real accessibility work landing around it. Re-flagging here so it doesn't get lost again; needs real content (or a tracked follow-up) before the repo goes public.

### Current state
- Static frontend unchanged and still fully functional standalone, including a verified-accessible responsive nav (contrast and tap-target size both confirmed passing). Docker Compose backend (PHP 8.3 + Apache, MySQL 8.4, phpMyAdmin) runs alongside it, verified end-to-end: site loads, DB connects, schema (6 tables) is correctly initialized, data persists across restarts, the placeholder dev user has no known/usable password, and `/api/health.php` no longer leaks exception details. No frontend code yet talks to the backend. Repo is private on GitHub; this session's work is pushed to `main`.

### Next step
Verify the hamburger tap-target size (carried over from Session 4), then start wiring the frontend to the backend — likely beginning with the custom-item-entry form (textbox + category picker) and its API endpoint, since that unblocks testing the per-user items/categories tables end-to-end.

---

## Session 4 – 2026-09-22

### What I worked on
- Fixed the "Add Shopping Items" heading (`#shopping-items-heading`) sitting inside the `.category-list` grid as a regular grid item, causing it to share a row with the Produce/Meat groups at ≥40rem instead of spanning full width above them. Added `grid-column: 1 / -1;` to force it onto its own full-width row regardless of column count.
- Built the full responsive nav menu (a menu that adapts its layout to screen size — a row of links on desktop, a collapsible hamburger menu on phones):
  - Added a hamburger `<button id="nav-toggle">` (the ☰ icon button that opens/closes the mobile menu) with `aria-expanded`/`aria-controls`/`aria-label="Menu"` (ARIA attributes: extra HTML properties that tell screen readers — software blind/low-vision users rely on to read a page aloud — what a control does and its current state), wrapping the three nav links in `<div id="nav-links">`; caught and removed a duplicate leftover `<nav>` block from the initial markup pass.
  - `script.js` toggle logic: click listener toggles `.nav-open` on `#nav-links` and syncs `aria-expanded`.
  - Mobile-first CSS (styling written for the smallest screen first, then layered with larger-screen overrides): `#nav-links` hidden by default, shown via `.nav-open`; `@media (min-width: 40rem)` (a media query — a CSS rule that only applies above/below a given screen width) override hides the toggle button and shows links inline as a row.
  - Styled the nav bar (`body > nav` flex row, centered, padding, background) and link padding.
  - Right-aligned the hamburger button at narrow widths via `margin-left: auto` (outside the media query, since the button is hidden at desktop anyway).
  - Converted the mobile menu into a full-width dropdown: `flex-wrap: wrap` on `body > nav` + `flex-basis: 100%` on `#nav-links.nav-open`, so the link list drops to its own full-width row below the fixed-position button.
  - Fixed a specificity edge case (CSS specificity: the rule that decides which of two conflicting style rules "wins" — here an id+class selector was beating a plain-id one): added a same-specificity `#nav-links.nav-open` override inside the `40rem` media query (`flex-direction: row; flex-basis: auto;`) so the desktop layout wins even if `.nav-open` is still applied when the viewport is widened.
  - `script.js`: added a `matchMedia('(min-width: 40rem)')` (a JS API that watches for a screen-size condition and fires a callback when it changes) change listener to force-close the menu (remove `.nav-open`, reset `aria-expanded`) when the viewport crosses into desktop width, so it can't reappear "stuck open" if later narrowed again.
  - `script.js`: added click-outside-to-close and Escape-to-close (with focus returned to the toggle button), plus a Tab/Shift+Tab focus trap (JS that keeps keyboard focus cycling only through the open menu's items, so a keyboard-only user can't tab "past" it into hidden page content) confining keyboard focus to the toggle button + links while the menu is open.
- Discussed and deferred the skip-link's visual styling — decided to leave it as a plain, unstyled, always-visible top-left link (it's already first in the DOM, so no positioning CSS is needed either way) rather than the usual hidden-until-focus pattern.
- Manual accessibility pass on the new nav work and a general recheck:
  - Found and fixed: `#grocery-list` section was missing an accessible landmark name (a label that lets a screen reader announce "Grocery List region" instead of just "region") — no `aria-labelledby` (an ARIA attribute that points a section at the heading that names it) — inconsistent with the Shopping Item Selection section from Session 3 — added `id="grocery-list-heading"` + matching `aria-labelledby`.
  - Found and flagged (not yet fixed): nav background (`gray`) vs. default browser link blue gives ~2.4:1 contrast (contrast ratio: how much a text color stands out from its background — higher is more readable), failing WCAG AA's 4.5:1 requirement for normal text.
  - Flagged for manual verification (not yet checked): whether `#nav-toggle`'s actual rendered hit area meets the 24×24px minimum target size (WCAG 2.2 SC 2.5.8).
  - Confirmed no regressions: focus outlines untouched, all 7 category `role="group"`/`aria-labelledby` pairs still correct, `aria-expanded`/`aria-controls` stay synced through every JS code path.

### Files / components changed
- `index.html` — hamburger button + nav-links wrapper markup, removed duplicate `<nav>`, added `aria-labelledby`/`id` to the Grocery List section.
- `styles.css` — `#shopping-items-heading` grid-column fix, full mobile-nav rule set (`#nav-links`, `#nav-links.nav-open`, `#nav-toggle`, `body > nav`, `nav a`, and the `40rem` media-query overrides).
- `script.js` — created from empty; nav toggle, desktop-breakpoint auto-close, outside-click close, Escape close, and Tab focus trap.

### Problems encountered and how they were resolved
- Repeatedly placed new nav CSS rules in the wrong scope relative to the `40rem` media query (mobile-first default vs. desktop override), most notably duplicating a conflicting `display` declaration on `#nav-links` and, separately, moving `#nav-toggle`'s `display: none` fully outside the media query (hiding the button at all widths, making the menu briefly unreachable) instead of adding a *separate* `margin-left: auto` rule alongside it. Each was caught by re-reading the file directly off disk and walking through the cascade/specificity explicitly before the next attempt.
- Diagnosed (via manual grid auto-placement trace — following CSS Grid's default rule for slotting items into cells when you haven't told it exactly where to go) that the heading's mislayout wasn't a positioning issue but a grid auto-flow issue — the `<h2>` was being auto-placed as an ordinary grid item alongside the category groups at ≥40rem.
- Identified a real specificity conflict: `#nav-links.nav-open` (id+class) outranked the media query's plain `#nav-links` rule, so a menu left open while resizing past the breakpoint stayed in the mobile layout. Fixed by adding a matching-specificity override inside the media query.

### Decisions and reasons
- Used `margin-left: auto` (not a `justify-content` change) to right-align the hamburger button — scoped to exactly the element that needs it, and has no effect once the button is hidden at desktop, so no override was needed elsewhere.
- Used `flex-wrap` + `flex-basis: 100%` (not `position: absolute`) to make the mobile menu a full-width dropdown — keeps it in normal document flow, pushing page content down rather than overlaying it.
- Handled the "menu left open across a resize" edge case with a same-specificity CSS override inside the media query, rather than a JS resize listener alone — the desktop layout is guaranteed correct immediately via CSS regardless of JS timing; JS is still used separately to *reset the actual open/closed state* (`.nav-open` class + `aria-expanded`) so it doesn't resurface incorrectly if narrowed again later.
- Chose a plain, unstyled, always-visible skip-link over the usual hide-until-focus pattern — since it's already first in the DOM and renders top-left with zero CSS, adding offscreen/focus-toggle CSS was judged unnecessary complexity for no visible benefit right now.
- Full WCAG 2.2 AA audit remains deferred (color contrast still can't be fully assessed without a finished color scheme) — but the nav's new `gray` background was audited on its own since it's an actual color decision made this session, and it failed outright.

### Accessibility
- Nav toggle button built with `aria-expanded`/`aria-controls`/`aria-label="Menu"` from the start, kept in sync through every JS code path (click, resize, outside-click, Escape).
- Added click-outside-to-close and Escape-to-close (with focus returned to the toggle button), plus a Tab/Shift+Tab focus trap confining keyboard focus to the toggle button + links while the menu is open.
- `matchMedia` listener force-closes the menu and resets `aria-expanded` when the viewport crosses into desktop width, preventing a "stuck open" state.
- Found and fixed: `#grocery-list` section was missing an accessible landmark name (no `aria-labelledby`) — added `id="grocery-list-heading"` + matching `aria-labelledby`, consistent with Session 3's Shopping section.
- Found and flagged (not yet fixed): nav background (`gray`) vs. default browser link blue gives ~2.4:1 contrast, failing WCAG AA's 4.5:1 requirement for normal text.
- Flagged for manual verification (not yet checked this session): whether `#nav-toggle`'s rendered hit area meets the 24×24px minimum target size (WCAG 2.2 SC 2.5.8) — later confirmed passing in Session 5.
- Confirmed no regressions: focus outlines untouched, all 7 category `role="group"`/`aria-labelledby` pairs still correct.
- Discussed and deferred the skip-link's visual styling — left as a plain, unstyled, always-visible top-left link rather than the usual hidden-until-focus pattern, since it's already first in the DOM.

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
- Full accessibility pass (WCAG-adjacent — WCAG is the Web Content Accessibility Guidelines, the standard rulebook for accessible sites — manual review, items #1–#7):
  1. Restored the Shopping section's accessible name via `aria-labelledby`/`id` (`aria-labelledby` is an ARIA attribute — an extra HTML property that tells screen readers, the software blind/low-vision users rely on to read a page aloud, what a section's name is) (broken when `<h2>` was moved out of the section in Session 2).
  2. Wired the nav's placeholder links to real in-page targets (`#grocery-list`, `#accessibility-statement`) with `tabindex="-1"` (an attribute that lets an element receive keyboard focus programmatically, even though it's not normally tabbable) on targets for reliable focus; left "Home" as a real link to `index.html`.
  3. Added a skip-to-main-content link (a hidden-until-focused link, usually the first thing on the page, that lets a keyboard user jump straight past the repeated nav links) (`<main id="main-content">`).
  4. Wrapped each category in `role="group"` (an ARIA role telling assistive tech "these related controls belong together") + `aria-labelledby`, tied to a unique `id` on each `<h3>`.
  5. Converted each category's item buttons from `<div>`s to `<ul>`/`<li>` for list semantics (using real HTML list elements so a screen reader announces "list of 8 items" instead of treating them as unrelated boxes); added `list-style: none; margin: 0;` to `.category-grid` to offset `<ul>` browser defaults.
  6. Added `id="grocery-list-items"` and `aria-live="polite"` (an ARIA attribute that makes a screen reader automatically announce new content added to this area, without interrupting whatever the user is doing) to the (re-added) empty Grocery List `<div>`, prepping it for the v0.2.0 script.
  7. Bumped the footer's `Accessibility Statement` heading from `<h3>` to `<h2>` (top-level landmark, not a subsection).
- Also fixed the "Musili"→"Muesli" typo and shortened "Greek Yogurt"→"Yogurt" while converting Pantry/Dairy to list items.
- Discussed a full WCAG 2.2 AA audit; deferred — color contrast can't be meaningfully assessed before real colors are chosen, and no automated tooling was run.

### Files / components changed
- `index.html` — nav hrefs, skip link, `id`s/`aria-labelledby`/`role="group"`/`tabindex` throughout, `<ul>/<li>` conversion for all 7 categories, footer heading level, re-added Grocery List `<div>` with live-region attributes.
- `styles.css` — CSS review items 1–6, new `.category-list` class, `list-style`/`margin` reset for the new `<ul>`.

### Problems encountered and how they were resolved
- Several rounds of edits broke things and were caught by re-checking: a stray unmatched `<div>`/`</section>` split during the rename, mismatched selectors left pointing at old class names after a rename (dead CSS), a malformed multi-line CSS "comment" (`/** ... **/`) that an inner `/* */` closed early, leaving invalid trailing tokens, and a dangling `aria-labelledby` reference caused by a duplicated/misplaced closing `</section>` tag. All caught via re-reading the file (occasionally needing a direct disk read via Bash when the IDE buffer lagged behind a save) rather than trusting paste/description alone.

### Decisions and reasons
- Used `clamp()` (a CSS function that smoothly scales a value like padding between a minimum and maximum based on screen size, instead of jumping at a fixed breakpoint) over a `min-width` media query for padding (fluid scaling, no breakpoint to pick/maintain).
- Kept `.category-list` (3-column grouping) as a separate class from `.list-section` rather than modifying `.list-section` directly, to avoid coupling the Grocery List section's layout to the Shopping section's.
- Accessibility fixes were scoped to manual code review only — no automated tooling (axe/Pa11y/Lighthouse: browser tools that automatically scan a page for common accessibility problems) run, consistent with the project's no-Node-tooling stance (Node.js is a JavaScript runtime most such tools require — this project intentionally avoids adding it as a dependency); a full WCAG 2.2 audit was offered but deferred by the user for a future session.

### Accessibility
- Restored the Shopping section's accessible name via `aria-labelledby`/`id` (broken when `<h2>` was moved out of the section in Session 2).
- Wired the nav's placeholder links to real in-page targets (`#grocery-list`, `#accessibility-statement`) with `tabindex="-1"` on targets for reliable focus; left "Home" as a real link to `index.html`.
- Added a skip-to-main-content link (`<main id="main-content">`).
- Wrapped each category in `role="group"` + `aria-labelledby`, tied to a unique `id` on each `<h3>`.
- Converted each category's item buttons from `<div>`s to `<ul>`/`<li>` for list semantics; reset browser default list styling in CSS.
- Added `id="grocery-list-items"` and `aria-live="polite"` to the empty Grocery List `<div>`, prepping it for the v0.2.0 script.
- Bumped the footer's `Accessibility Statement` heading from `<h3>` to `<h2>` (top-level landmark, not a subsection).
- Full WCAG 2.2 AA audit and color-contrast review deferred — no real colors chosen yet, no automated tooling run.

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
- Started on responsive design (a layout that adapts to different screen sizes) and CSS. I first wrote a full mobile-first `styles.css` myself, then reverted it (see below); the user is writing the styles.
- The user's own CSS work: added `.section-styles` (flex row — a layout mode that lines child elements up horizontally — border, padding), changed `.category-styles` to a CSS grid (a layout mode that arranges items into rows and columns; `repeat(auto-fill, minmax(9rem, 1fr))` means "fit as many 9rem-or-wider columns as will fit, and stretch them evenly", `gap: 0.75rem` is the spacing between items), added a global `button` rule (`width: 100%`, padding, margin).
- The user's HTML changes: added `class="section-styles"` to both `<section>`s, moved the "Add Shopping Items" `<h2>` out of its `<section>`, and moved each category `<h3>` inside its `.category-styles` div.
- Explained ways to make the item buttons a uniform size (grid, fixed flex basis, fixed width).
- Reviewed the user's CSS and listed improvements (next step).

### Files / components changed
- `styles.css` – user's new `.section-styles`, grid-based `.category-styles`, `button` rule.
- `index.html` – `section-styles` classes; `<h2>` and `<h3>` moved as described above.

### Problems encountered and how they were resolved
- I wrote a full `styles.css` when only asked to "add responsive design and styles". The user reverted it (`git checkout -- styles.css`, a git command that discards uncommitted changes to a file and restores it to its last-committed state) and set a rule: no styles from me. Recorded as a project memory rule.

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
- Set up the repo (repo = repository, the git-tracked folder holding the project's files and history): `git init` (creates a new git repository) on `main` (the primary branch), added `.gitignore` (a file listing what git should never track, e.g. secrets or build output) and `README.md`.
- Fixed the Dairy section in `index.html` (missing closing `</div>`, duplicated Dairy buttons). Verified afterwards: 45 opening / 45 closing `<div>`, 2/2 `<section>`.
- Connected to https://github.com/Auroradidthat/grocery_app and got the first commit onto remote `main` (remote = the copy of the repo hosted on GitHub, as opposed to the local copy on this machine).
- Added a changelog to the README and introduced versioning (SemVer — Semantic Versioning, a `MAJOR.MINOR.PATCH` numbering convention — `0.x` means initial development); tagged (a git tag marks a specific commit as a named release point, e.g. `v0.1.0`) and pushed `v0.1.0`.
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
- **First push rejected.** The remote already had an "Initial commit" (`curriculum_files/` plus starter `.gitignore`, `index.html`, `styles.css`). Fetched (downloaded the remote's history without merging it yet) and inspected it, then rebased (replayed my commit on top of the remote's history, so the project ends up with one straight line of commits instead of a merge) my commit on top: kept my `index.html` and `styles.css`, merged the two `.gitignore` files.
- **Commit landed on the wrong branch.** The repo was on a `dev` branch (branch = a separate, parallel line of commits) I hadn't noticed, so the changelog commit and the `v0.1.0` tag went to `dev` and `git push origin main` reported "Everything up-to-date". Resolved by merging `dev` into `main` and pushing with `--follow-tags` (a flag that pushes any new tags along with the commits, since tags aren't pushed by default).
- **Remote changed mid-session.** `curriculum_files/` and the old `README.md` were deleted on GitHub, so merging `dev` gave a modify/delete conflict on `README.md`. Kept our README.
- **Wrong branch again at session end.** `HEAD` was on `release` (`dev` and `release` had been fast-forwarded to `main`'s commit). Switched to `main` and deleted both branches. `CLAUDE.md` now says to check the branch before committing.

### Decisions and reasons
- Rebase, not force-push (a git push that overwrites the remote's history — risky, since it can erase others' commits), to preserve the remote's existing history.
- SemVer starting at `v0.1.0` (first working page); `0.x` signals initial development. Patch for fixes, minor for features, `1.0.0` when ready for real use.
- README changelog = release/version history; DEVLOG = per-session notes. Kept separate on purpose.
- Docs-only fixes don't bump the version.
- No `package.json` / `npm version`; not worth Node tooling for a plain HTML/CSS project.

### Security
- Kept the remote's `.gitignore` and extended it with `.env.*`, `npm-debug.log*`, `*.swp`, `build/` — secrets/dependency hygiene established before any backend or credentials existed.

### Attempted / left unresolved
- `README.md` was created with a UTF-8 byte-order mark (a few invisible bytes some tools add at the start of a text file to mark its encoding — usually harmless) (PowerShell `Set-Content -Encoding utf8`); harmless, not stripped.
- Git warns about LF→CRLF conversion (LF and CRLF are two different ways operating systems mark a line break in a text file — Linux/Mac use LF, Windows uses CRLF, and git can auto-convert between them); no `.gitattributes` (a config file that controls exactly how git handles these conversions per file type) added.
- `index.html` cosmetic issues left as-is: stray space in `<div >` (Meat, Beef), "Musili" likely meant "Muesli", footer accessibility statement is lorem ipsum, nav links are `href="#"` placeholders.

### Current state
- `v0.1.0` tagged and pushed; `main` is the only branch and matches `origin/main`.
- Static page only: item buttons do nothing, the Grocery List section is an empty `<div>`, no JavaScript yet.

### Next step
Start v0.2.0: add a script (e.g. `script.js`, linked from `index.html`) so clicking an item button adds that item to the Grocery List section. First give the empty `<div>` in the Grocery List section an `id` to target.
