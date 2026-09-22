# Dev workflow template

This is the session-based development workflow established in the `grocery_app`
repo (see its `CLAUDE.md` / `DEVLOG.md`), extracted so it can be dropped into
any future project. It gives an AI coding assistant (or a human collaborator)
persistent memory of a project across sessions, without relying on chat
history.

## Why this exists

A single session's context disappears when it ends. Two files fix that:

- **`CLAUDE.md`** — the *rules*. Read once per session, rarely changes.
  Says how to work in this repo: what to read at session start, what to
  record at session end, and Git conventions.
- **`DEVLOG.md`** — the *memory*. Written once per session, grows over time.
  A running log detailed enough that reading the top entry alone tells you
  where the last session left off, with no need to re-derive it from the
  diff or git log.

Kept deliberately separate from `README.md`, which stays a *release*
changelog (SemVer, user-facing) — not a development diary. Mixing the two
makes both harder to read: the README stops being a clean version history,
and the dev notes stop being chronological/complete.

## The three files, and what each is for

| File | Purpose | Changes... |
|---|---|---|
| `CLAUDE.md` | Process rules for this repo | Rarely — only when the workflow itself changes |
| `DEVLOG.md` | Per-session development notes, newest first | Every session, one new entry |
| `README.md` | Release/version changelog (SemVer) | Only on an actual release/version bump |

## Session start

The very first thing a new session does, before any other work: **read the
top (most recent) entry of `DEVLOG.md`** and tell the user, briefly, where
they left off and what that entry's **Next step** said — before touching
any code. This is the mechanism that makes the log actually useful; a log
nobody reads at the start of the next session is just a write-only diary.

## Session end

Before ending a session:

1. Draft a new `DEVLOG.md` entry (see format below) and **show it to the
   user for approval** — don't write it into the file unapproved.
2. Once approved, commit it **together with** the rest of the session's
   code/file changes, in one commit.
3. Confirm with the user before pushing. Never force-push.

### DEVLOG entry format

Newest entry at the top, entries separated by `---`. Each entry:

```markdown
## Session N – YYYY-MM-DD

### What I worked on
- ...

### Files / components changed
- `path/to/file` – what changed and why

### Problems encountered and how they were resolved
- ...

### Decisions and reasons
- ...

### Attempted / left unresolved
- ...

### Current state
- One or two lines: what actually works right now, what doesn't yet.

### Next step
The specific thing to resume with — concrete enough that session start
can just read this and go, with no re-deriving from the diff.
```

Write it detailed enough that someone with **zero memory of the session**
could reconstruct what happened and why, from the entry alone — not just
"what" but "why" (the *Decisions and reasons* section is what usually gets
skipped and is the one most worth keeping).

## Git conventions

- Work on `main` (or the repo's equivalent default branch) unless told
  otherwise. **Check the current branch before committing** — it's easy to
  be on a stale feature/dev branch without noticing.
- Never force-push.
- Confirm with the user before pushing, even when the commit itself was
  clearly authorized.
- Prefer a new commit over amending; don't skip hooks or bypass signing
  unless explicitly told to.
- Docs-only fixes (e.g. correcting a stale changelog line) generally don't
  need a version bump.

## Bootstrapping a new project with this workflow

1. Copy `CLAUDE.md.template` → `CLAUDE.md` at the new repo's root. Edit the
   placeholder bits (see comments inside it) — most of it can be used as-is.
2. Copy `DEVLOG.md.template` → `DEVLOG.md` at the repo root.
3. Make sure `README.md` exists and has (or will have) its own `## Changelog`
   section, separate from anything in `DEVLOG.md`.
4. Add project-specific rules to `CLAUDE.md` as they come up — e.g.
   standing preferences like "don't write CSS, I write styles myself,"
   testing conventions, deploy steps. `CLAUDE.md` is meant to accumulate
   these over time; it's a living rulebook, not a one-time setup file.
5. At the end of the first working session in the new repo, write the
   first `DEVLOG.md` entry (`## Session 1 – <date>`) following the format
   above, get it approved, and commit it with the rest of the session.
