AURORA'S LESSON SYSTEM - README
=================================

CURRENT VERSION: main_config-v5.0.0.md
(check changelog.md for what changed and when)

This is the integrated HTML/CSS/JS system, replacing the JS-only
system that last stood at main_config-v47.0.0.md. Versioning restarts
at 1.0.0 for this system - the old JS-only history stays archived in
its own changelog, not merged into this one.

WHAT THIS IS
------------
A self-directed lesson system, built for one-on-one learning with an
AI tutor, covering HTML, CSS, and JavaScript together as one front-end
curriculum, with accessibility woven into lessons from the start
rather than taught separately. It splits into two files so the
teaching rules and your personal progress never get tangled together:

  - main_config       - the rules. How lessons are paced, how
                         exercises are built, how feedback is given,
                         across all three stacks. Rarely changes.
  - user_config.yaml  - your progress. What tier/topic, what
                         scenario, what you've completed, what
                         patterns have shown up in your work, by
                         stack. Changes every lesson.

Paste both into a new chat and the assistant picks up exactly where
you left off - no re-explaining the course, no repeating what you
already know.


THE TWO-FILE SPLIT
-------------------
                    main_config              user_config.yaml
Holds               rules and structure      your state and history
Changes              only when a rule is      every lesson
                     added, removed, or
                     reworded
Shared across        yes - topic-agnostic     no - specific to you
courses?                                      and this curriculum
Named                main_config-v{version}.md   user_config.yaml

This is the single most important thing to understand before editing
either file by hand. If you want to change how lessons are taught -
pacing, exercise format, feedback style - that's a main_config
change. If you want to change what's being taught or how far along
you are, that's user_config.yaml.


STARTING A NEW SESSION
-----------------------
  Both files pasted in:
    The assistant reads your saved progress and resumes from there -
    same tier/topic, same scenario, no need to re-explain anything.

  Only main_config pasted in:
    The assistant checks for saved progress, doesn't find any, and
    asks plainly whether you'd like it to start saving some. Say yes
    and it walks you through setting up a course from scratch.


HOW SAVING WORKS
------------------
At the end of every lesson - once all concepts and exercises are
done - you'll be asked: "Save your progress so far?"

  Yes: your progress file updates with what happened that lesson -
       what's complete, what scenario was used, anything worth
       remembering about how you're doing, tagged by stack. If any
       rule changed during the lesson, the rules file is saved too,
       as a new version. You'll get a plain confirmation either way -
       no file jargon, unless you ask about the files directly.

  No:  nothing is written, and you'll be told plainly that nothing
       was saved.


SUGGESTING CHANGES MID-SESSION
--------------------------------
You don't have to wait for the end of a lesson to change how things
work. At any point in a session, you can ask for a change to the
rules - pacing, formatting, what gets flagged, anything about how
you're being taught. When you do:

  - The change is made to the rules immediately, not queued for
    later.
  - The rules file is versioned and saved right away, automatically
    - you don't need to separately ask for a save.
  - You'll be told plainly what changed and that the file was
    updated, without needing to ask.

This is different from the end-of-lesson prompt, which is about
saving your PROGRESS. Suggesting a rule change saves the RULES, on
the spot, every time.


VERSIONING
----------
Every rules change gets a version number and a line in the
changelog. This system's own numbering starts at 1.0.0 - it does not
continue the old JS-only template's v47.0.0.

  Major (1.0.0 -> 2.0.0):
    a rule was added, removed, or its substance changed. Something
    about how lessons work is different.

  Minor (1.0.0 -> 1.1.0):
    wording, clarity, or an example changed, but the rule itself
    requires nothing different than before.

Full history of every change lives in changelog.md - check there
rather than trying to diff the rules file by hand. As of this file,
five rule changes have been made since the v1.0.0 baseline (v2.0.0
through v5.0.0), all during Topic 1.


FILE NAMING
------------
  Rules:     main_config-v{version}.md   (e.g. main_config-v5.0.0.md)
  Progress:  user_config.yaml            (no version number - always
                                          the latest, overwritten
                                          each save)
  History:   changelog.md


WHAT'S DIFFERENT FROM THE JS-ONLY SYSTEM
------------------------------------------
  - Every concept and exercise is tagged by stack (html / css / js /
    integrated), and the recurring-pattern watch, coverage tracker,
    and reference sheet all key off that tag.
  - Accessibility is woven into relevant concepts from Tier 1 onward,
    not taught as a separate later unit.
  - Predict-before-reveal now has a defined shape for CSS (predict the
    cascade/computed result) and HTML (predict the semantic/
    accessibility-tree result), not just JS output - all still
    text/code only, no live rendered preview, since exercises are run
    by hand.
  - Debugging exercises have a per-stack definition of what "broken
    silently" means, and are capped at two independent faults each
    (added v3.0.0).
  - The old operator-rotation tracker is now a coverage-rotation
    tracker spanning JS operators, CSS selector categories, and HTML
    element categories.
  - The learning map is a fresh 5-tier, 25-topic sequence built for
    front-end fundamentals broadly, not the old 3-tier JS-only map.
    JS-only progress was not carried forward.


KNOWN LIMITATIONS
-------------------
  - Debugging exercises assume you can run the code/markup/styles
    yourself to check a result - there's no live rendering built into
    the tutoring session itself.
  - A "core rules + per-topic module" split, so one core file could
    serve entirely unrelated subjects cleanly, is a planned future
    direction, not something built yet.


MAKING CHANGES
----------------
  - Want to change how you're taught? Say so, any time, in a
    session. It updates and saves automatically - see "Suggesting
    changes mid-session" above.
  - Want to change what you're learning or your progress? That's
    user_config.yaml, and it's meant to be edited through the
    end-of-lesson save prompt, not by hand.
  - If a rule change does NOT auto-save, that's a bug in following
    the rules - not a sign the rule itself needs rewriting.
