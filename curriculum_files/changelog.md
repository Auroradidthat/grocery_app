# Changelog - main_config
Integrated Front-End Fundamentals (HTML/CSS/JS)

This changelog starts fresh at v1.0.0 for the integrated system. The
prior JS Fundamentals changelog (v1.0.0 through v47.0.0) documents a
separate, superseded template and is not reproduced or renumbered
here - keep it as an archived record if you want the full history of
how the JS-only rules evolved.

Timestamp format (carried over from the prior changelog's convention,
v41.0.0 onward): `DD MON YYYY HHMM`, pulled from a real time check.
Entries with no real time check available are marked as such rather
than estimated.

## v1.0.0 (baseline)
11 SEP 2026 [time unavailable this turn - no time-check tool used]

New baseline superseding JS Fundamentals `main_config-v47.0.0.md`.
Consolidates the prior 47-version, JS-only ruleset into a single
template spanning HTML, CSS, and JavaScript together, built for
integrated front-end fundamentals training rather than JS alone.

Carried over unchanged (mechanism, not wording):
- Chunking (max 4 concepts/lesson), fixed scenario per lesson,
  externalized-state instruments, predict-before-reveal, silent-fault
  debugging, self-contained exercise instructions, one-exercise-per-
  message, immediate versioning with a reason attached to every rule,
  canonical-terminology introduction and expectation, cumulative
  reference sheet, recurring-pattern watch, save/resume flow, file
  naming conventions, verify-before-stating discipline.

New in this version:
- **Stack tagging.** Every concept and exercise now carries a `stack`
  tag (`html` / `css` / `js` / `integrated`), which the recurring-
  pattern watch, the coverage tracker, and the reference sheet all key
  off of.
- **Accessibility woven in from Tier 1, not a separate tier.** Rule 2's
  elaboration step now names accessibility implications (semantics,
  keyboard operability, screen-reader behavior, focus order, contrast,
  motion) wherever a concept genuinely has one, starting with the
  first lesson - not deferred to a dedicated accessibility unit.
  Requested directly by Aurora when the tier map was proposed.
- **Predict-before-reveal extended per stack**, text/code only, no
  live rendered preview - CSS predicts the cascade/computed result,
  HTML predicts the semantic/accessibility-tree result, JS keeps its
  existing output-prediction behavior. Requested directly by Aurora:
  exercises stay text/code only because she renders them herself.
- **Silent-fault definition extended per stack** for debugging
  exercises - JS (wrong value, no error), CSS (wrong rendered result,
  no console error), HTML (wrong semantics/accessibility behavior, no
  console error), with a note for integrated exercises where a fault
  can live in the seam between stacks.
- **New externalization instruments:** a CSS cascade/specificity trace
  table and an HTML DOM/accessibility-tree table, alongside the
  existing JS trace tables and array-per-index breakdown table.
- **Operator-rotation tracker renamed and expanded** to a
  coverage-rotation tracker spanning JS operator categories, CSS
  selector categories, and HTML element categories.
- **Learning map fully restructured**: 5 tiers, 25 topics, integrated
  from Tier 1 onward (see `user_config.yaml`). Replaces the 3-tier,
  18-topic JS-only map.
- **Live-project boundary reaffirmed explicitly** for the integrated
  system: exercises still don't tie to Aurora's live portfolio site or
  any real project; an optional one-line "this could apply to your
  site" suggestion is allowed at lesson's end, never a requirement.
- **Versioning resets to 1.0.0** for this system. The JS-only template
  history stays where it is, unmerged.

Requested directly by Aurora, migrating her existing JS Fundamentals
system into a full integrated HTML/CSS/JS curriculum ahead of her
front-end job search. Prior JS-only progress (Topic 8 of 18, "Arrays &
indexing") is intentionally not carried forward - this is a full
restart at Tier 1, Topic 1 of the new map, per her explicit choice.

## v2.0.0
12 SEP 2026 [time unavailable this turn - no time-check tool used]

Two changes, both requested in the same exchange, during Topic 1
Concept 1:
- **No em dashes or other hard-to-type symbols in mandatory text.**
  Any text the learner is asked to reproduce exactly (titles,
  headings, required strings, scenario values) now uses only standard
  keyboard characters - regular hyphens, straight quotes, apostrophes.
  Scoped to text she must type verbatim only; prose and explanations
  are unaffected. Prompted by two dropped em dashes in exact-text
  copying, which the learner flagged as a hard-to-type character that
  shouldn't be a hidden part of what's being tested.
- **No live self-correction narrated in a message.** If a mistake is
  caught while drafting a response (wrong verdict, wrong framing), it
  gets fixed before sending, never narrated mid-message ("wait, this
  is actually..."). Extends the existing verify-before-stating
  discipline explicitly to cover this case. Prompted by an instance of
  exactly this happening in an exercise-type verdict.

Requested directly by Aurora.

## v3.0.0
12 SEP 2026 [time unavailable this turn - no time-check tool used]

Two changes, both requested in the same exchange, following Topic 1
Concept 2's final exercise:
- **Maximum two independent faults per debugging exercise**, at any
  difficulty tier within a concept. A topic with three or more real
  problems becomes two exercises instead of one stacked exercise.
- **Naming a fault correctly is a complete answer on its own.**
  Explaining the mechanism or effect becomes optional rather than
  required, unless the naming itself is too ambiguous to confirm
  understanding without it.

Prompted by Concept 2's final debugging exercise, which stacked three
independent faults into one exercise and required a full mechanism
explanation for each, right as fatigue set in. Requested directly by
Aurora.

## v4.0.0
12 SEP 2026 [time unavailable this turn - no time-check tool used]

Added: **minimum viable code per exercise - no empty elements without
a stated reason.** Every required element in an exercise must either
hold actual required content, or be structurally mandatory to a valid
document (doctype, `<html>`, `<head>`, `<body>`) with nothing further
asked of it. An element is never required into an exercise just to sit
empty without one of those two reasons; if full-skeleton practice is
the point, that gets stated explicitly as the reason.

Prompted by a Topic 1 Concept 3 exercise that required an empty
`<head>` element with no stated reason for including it - the learner
asked why it was mentioned at all if nothing was meant to go inside it,
which surfaced that the requirement had no real justification behind
it. Requested directly by Aurora.

## v5.0.0
12 SEP 2026 [time unavailable this turn - no time-check tool used]

Added: **every exercise requirement must have a genuine, statable
reason before posting.** Extends the existing verify-before-posting
rule: alongside checking that an exercise is solvable and (for
debugging) genuinely broken, each individual requirement bullet is now
checked for a real semantic, accessibility, or structural
justification before the exercise goes out. A requirement with no
statable reason gets dropped or reworded before posting, not left in
and explained away if questioned afterward.

Prompted by a Topic 1 Concept 4 exercise that required wrapping a nav
link in a `<p>` tag with no real accessibility or semantic basis - the
requirement only existed because it was written into the scenario
without being checked against Rule 10 first. The learner asked that
this class of error not recur. Requested directly by Aurora.

## v6.0.0
12 SEP 2026 [time unavailable this turn - no time-check tool used]

Added: **Rule 13 - CSS centers accessibility and responsive design.**
For any concept or exercise tagged `css` or `integrated` where CSS is
the touched piece, accessibility and responsive-design considerations
are now a first-class part of the teaching wherever genuinely
applicable - relative units over hardcoded pixels, responsive
mechanisms (media queries, fluid sizing) woven in as soon as a concept
touches layout or sizing rather than deferred entirely to Tier 4, and
accessibility-relevant CSS selectors/properties (`:focus-visible`,
`prefers-reduced-motion`, `prefers-color-scheme`, contrast-affecting
properties) surfaced as soon as a concept's scope includes them.
Scoped by genuineness, same as Rule 10 and the statable-reason rule -
not forced onto concepts with no such angle.

Requested directly by Aurora mid-lesson, during Topic 2 Concept 1,
before any exercises were posted for that concept. Substance change
(not wording), hence a major bump.

## v7.0.0 (current)
12 SEP 2026 [time unavailable this turn - no time-check tool used]

Added: **Rule 14 - Modern web development baseline.** Everything
taught, shown, or written across HTML, CSS, and JS now reflects
modern, current practice as a standing prerequisite alongside the
fundamentals-first teaching order - semantic HTML5 by default, modern
CSS layout tools (flexbox/grid) and classes-as-default-styling-hook
over ID-heavy legacy convention, and ES6+ JS conventions (`let`/`const`
over `var`, arrow functions, template literals) as the default syntax.
Legacy patterns are shown only when explicitly teaching why they were
replaced, never as the current recommended approach. Scoped by
genuineness, same as Rules 10 and 13 - doesn't mean bleeding-edge or
experimental features, and doesn't override a case where an older
approach is still genuinely correct.

Requested directly by Aurora mid-lesson, immediately following v6.0.0,
during Topic 2 Concept 1, before any exercises were posted for that
concept. Substance change (not wording), hence a major bump.

---

Total: 1 baseline version + 7 mid-course rule changes (v2.0.0 through
v7.0.0), all requested directly by Aurora during Topic 1 and Topic 2.
Current file: main_config-v7_0_0.md
