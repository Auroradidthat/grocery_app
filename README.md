# Aurora Goes Shopping

A simple grocery list app. Pick items from categories (Produce, Meat, Dairy, Pantry, Desserts, Cleaning Supplies, Dental Hygiene) to build a shopping list.

## Running locally

Frontend only, no backend: open `index.html` in a browser.

With the PHP/MySQL backend (Docker):
1. Copy `.env.example` to `.env` and fill in real dev passwords.
2. `docker compose up --build -d`
3. Site: http://localhost:8080/
4. DB health check: http://localhost:8080/api/health.php
5. phpMyAdmin: http://localhost:8081/

## Files

- `index.html` – page markup
- `styles.css` – styles
- `script.js` – nav menu behavior
- `docker-compose.yml`, `docker/` – local PHP/MySQL/phpMyAdmin stack
- `db/init/` – MySQL schema, auto-loaded on first container start
- `api/` – PHP backend endpoints

## Changelog

Versioning follows [Semantic Versioning](https://semver.org). `0.x` means initial development.

### v0.1.0 – 2026-09-19
- Added the grocery list page (`index.html`) with nav, header, a grocery list display area, and item buttons grouped by category: Produce, Meat, Dairy, Pantry, Desserts, Cleaning Supplies, Dental Hygiene.
- Added `.category-styles` flex row layout in `styles.css`, replacing the starter pastry-card styles.
- Fixed the Dairy section: added a missing closing `</div>` and removed duplicate item buttons.
- Added this README and extended `.gitignore` (`.env.*`, `npm-debug.log*`, `*.swp`, `build/`).
- Merged with the existing remote "Initial commit", replacing its starter `index.html` and `styles.css`.
