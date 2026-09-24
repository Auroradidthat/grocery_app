# Aurora Goes Shopping

A simple grocery list app. Pick items from categories (Produce, Meat, Dairy, Pantry, Desserts, Cleaning Supplies, Dental Hygiene) to build a shopping list.

## Running locally

Frontend only, no backend: open `index.html` in a browser. This is the plain HTML/CSS/JS page — no setup needed, it just runs.

With the PHP/MySQL backend (Docker): the project also has a real backend (server-side code + a database) built with PHP (a server-side programming language) and MySQL (a database). It runs inside Docker (a tool that packages an app and everything it needs — the exact PHP version, the database, etc. — into isolated, reproducible containers, so it behaves the same on any machine). Docker Compose is the tool that starts multiple containers together (here: the PHP server, the MySQL database, and phpMyAdmin) with one command.

1. Copy `.env.example` to `.env` and fill in local dev-only credentials (never reuse real passwords here). `.env` holds settings like the database password — it's excluded from git (see `.gitignore`) so real credentials never get committed.
2. `docker compose up --build -d` — builds and starts all three containers in the background (`-d` = detached, so it doesn't tie up your terminal).
3. Site: http://localhost:8080/
4. DB health check: http://localhost:8080/api/health.php — a small page that confirms the PHP server can successfully connect to the database.
5. phpMyAdmin: http://localhost:8081/ — a web-based tool for browsing and editing the MySQL database directly, useful for checking data without writing SQL by hand.
6. To stop: `docker compose down` (add `-v` to also delete the database's saved data — only do this if you want a totally clean slate).

This stack is for local development only (i.e. running on your own computer while building the app — not for running on a live server other people can reach). It publishes MySQL (port `3306`) and phpMyAdmin (port `8081`) directly to your machine's network — fine on your own computer, but don't run this `docker-compose.yml` as-is on a shared or cloud host, since anyone on that network could then try to reach the database directly.

## Files

- `index.html` – page markup
- `styles.css` – styles
- `script.js` – nav menu behavior; grocery list add/remove/quantity logic and its screen-reader announcer
- `docker-compose.yml`, `docker/` – local PHP/MySQL/phpMyAdmin stack (defines and configures the three containers described above)
- `db/init/` – MySQL schema (the database's table structure) and starting data, loaded automatically the first time the database container starts
- `api/` – PHP backend endpoints (the server-side code the frontend will eventually talk to)

## Changelog

Versioning follows [Semantic Versioning](https://semver.org) (a version-numbering convention: `MAJOR.MINOR.PATCH`). `0.x` means initial development — nothing is released yet.

### v0.2.0 – 2026-09-23
- Wired the grocery list to actually work: clicking a category item button adds it to the Grocery List.
- Added quantity controls — each added item shows `− Item +` buttons, where `+` increments and `−` decrements, fully removing the item once its quantity reaches 0.
- Built this accessibly: no keyboard/screen-reader focus loss at any step, and every add/increment/decrement/remove is announced immediately through a dedicated screen-reader status message.
- Made all buttons in the shopping section a uniform size.

### v0.1.0 – 2026-09-19
- Added the grocery list page (`index.html`) with nav, header, a grocery list display area, and item buttons grouped by category: Produce, Meat, Dairy, Pantry, Desserts, Cleaning Supplies, Dental Hygiene.
- Added `.category-styles` flex row layout in `styles.css`, replacing the starter pastry-card styles.
- Fixed the Dairy section: added a missing closing `</div>` and removed duplicate item buttons.
- Added this README and extended `.gitignore` (`.env.*`, `npm-debug.log*`, `*.swp`, `build/`).
- Merged with the existing remote "Initial commit", replacing its starter `index.html` and `styles.css`.
