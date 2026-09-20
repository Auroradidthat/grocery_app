# Project notes for Claude

## Documentation split
- `README.md` changelog: release and version history only (SemVer, `0.x` during the building stage).
- `DEVLOG.md`: per-session development notes, newest entry first.
Keep the two separate.

## Start of every session
Read the most recent (top) entry in `DEVLOG.md`. Briefly tell the user where they left off and what the recorded **Next step** was, before doing anything else.

## End of every session
Before ending, show the user the proposed DEVLOG entry and wait for approval. Then commit it together with the rest of the session's work. Do not commit the entry before it is approved.

Each entry uses these sections, concise but detailed enough to reconstruct the session without memory:
- What I worked on (including mundane changes and fixes)
- Files / components changed
- Problems encountered and how they were resolved
- Decisions and reasons (technical or architectural, when known)
- Attempted / left unresolved
- Current state
- Next step (the specific thing to resume with)

## Git
- Work on `main` unless told otherwise; check `git branch --show-current` before committing.
- Never force-push. Confirm before pushing.
