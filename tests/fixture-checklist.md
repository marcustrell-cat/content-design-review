# Fixture test: `fixtures/bad-copy-app`

A manual test for the skill. Run the review against the fixture, then score the
output against the lists below.

The expected findings live here, outside the fixture folder, so the review isn't
primed. Run it in a temporary copy so the skill can't read this file.

## Run

From the repository root:

```bash
tmp="$(mktemp -d)" && cp -R fixtures/bad-copy-app "$tmp/" && mkdir -p "$tmp/.claude/skills" && cp -R skill/ux-copy-review "$tmp/.claude/skills/content-design-review" && (cd "$tmp" && claude -p "/content-design-review bad-copy-app" > review.md) && diff -r fixtures/bad-copy-app "$tmp/bad-copy-app" && diff -r skill/ux-copy-review "$tmp/.claude/skills/content-design-review" && echo "No files changed. Review: $tmp/review.md"
```

The command:

1. copies the fixture and the skill into a fresh folder, with the skill installed as
   `.claude/skills/content-design-review/`
2. runs `/content-design-review bad-copy-app` headless with `claude -p`
3. checks that no fixture or skill file changed or was added (X7), then prints where
   the review is

Read `review.md` and tick the lists below. The model isn't deterministic, so run it
at least twice before calling a change to the skill good or bad.

If `claude -p` can't authenticate in your shell, set up the same temporary folder,
start `claude` in it, and type `/content-design-review bad-copy-app`. Then run the
`diff` by hand.

## Pass rule

- Every **Must catch** item is reported, in Confirmed problems unless it says
  otherwise, with a rewrite that meets the note.
- No **Must not** item happens.
- **Nice to catch** is a score, not a gate. Note it to track changes over time.

## Must catch

| # | Where | Original | Rule | A good rewrite… |
|---|-------|----------|------|-----------------|
| M1 | `index.html:39` | `Go` | ACT-1 | names the export, for example "Export CSV". |
| M2 | `index.html:55` | `Submit` | ACT-1 | names the result, for example "Save sighting". |
| M3 | `index.html:62-64` | "Are you sure?" / `Yes` / `No` | ACT-2 | names the action and object in the question and on the confirm button. |
| M4 | `index.html:40` | `+` with no accessible name | A11Y-1 | adds an accessible name such as `aria-label="Add sighting"`. |
| M5 | `app.js:122` | "You forgot to enter a species." | ERR-3 | asks for the species without blame. |
| M6 | `app.js:123` | "ERROR: You entered an invalid date!!" | ERR-3, ERR-4 (TONE-2 a plus) | states `YYYY-MM-DD`, without blame or shouting. |
| M7 | `app.js:124` | "Invalid input." | ERR-1, ERR-4 | names the location field and the `latitude, longitude` format. |
| M8 | `app.js:153` | "Error: QuotaExceededError. Operation failed." | ERR-1, ERR-2 (PLAIN-1 a plus) | says the sighting wasn't saved, in plain words, with a next step. Saying the entry is still in the form is allowed: the code keeps it. |
| M9 | `index.html:42` | "No data." | EMP-1, EMP-2 | says sightings will appear here and points to adding one. |
| M10 | several | "entry", "record", "observation", "data", "sighting" for one object | TERM-1 | picks one term, ideally "sighting" (data model, file name, README), and lists at least three locations. |
| M11 | `app.js:74` vs `app.js:93` | "Remove observation" vs "Entry deleted" | TERM-2 | uses one verb for the one delete function. Can be part of M10. |
| M12 | `index.html:15` (and the flow) | 74-word welcome paragraph | ONB-1 | cuts it to one short idea. |
| M13 | `index.html:12-33` | four steps, no way to skip | ONB-2 | adds a skip and/or cuts steps. |
| M14 | `index.html:20`, `index.html:25` | "Sync your records across all your devices", "Share observations…", "smart species suggestions powered by AI", "community guidelines", "set up your profile" | ONB-3 | flags the claims as not supported by the code (local storage only), and doesn't repeat them as fact. Reporting it as a question to confirm also passes. |
| M15 | `app.js:93` | "Whoops, it's gone forever! 👋" | TONE-1 | plain confirmation of a permanent delete. |
| M16 | `index.html:50-53` | placeholder-only fields | A11Y-2 | adds visible labels. |
| M17 | `index.html:51` | placeholder "Date" | PLAIN-2 | shows the `YYYY-MM-DD` format at the field. |
| M18 | `index.html:52` | "Geo-coordinates (WGS84 decimal)" | PLAIN-1 | plain label such as "Location (latitude, longitude)", marked optional, with an example. |

## Nice to catch

| # | Where | What | Rule |
|---|-------|------|------|
| N1 | `index.html:56` + `app.js:164-168` | `Back` silently clears the form | ACT-4 |
| N2 | `app.js:161` | toast "Success!" doesn't say what was saved | ACT-6 |
| N3 | `index.html:31` | `Let's Go!` doesn't say where it goes | ACT-1 |
| N4 | `index.html:54`, `index.html:67` | error and toast text injected with no `role="alert"` or `aria-live` | A11Y-4 |
| N5 | `index.html:14` | "Welcome to Field Log!!!" | TONE-2 |
| N6 | `index.html:30` | "Click the button below…" filler on a phone-first app | ONB-1 / PLAIN-3 |
| N7 | `app.js:16-22` | a storage read error shows the same "No data." as a first visit | EMP-3 |
| N8 | `app.js:104` | "Nothing to export." has no next step | EMP-2 |
| N9 | `app.js:74` | 🗑 button named only by `title` | A11Y-1 |
| N10 | report | voice items (for example "Remember: every great birder…") go in Suggestions with an `Assumes` line | TONE-4 |

## Must not

| # | Failure |
|---|---------|
| X1 | Says a deleted sighting can be restored, undone or found in a trash. |
| X2 | Says sightings sync, back up, or live in an account or the cloud. |
| X3 | Gives a date format other than `YYYY-MM-DD`, or mentions a date picker as if it exists. |
| X4 | Says location or notes are required. |
| X5 | Invents a support email, URL or help page instead of a `[placeholder]`. |
| X6 | Rewrites onboarding with the sync, share or AI claims kept as fact. |
| X7 | Changes any file. The run command's `diff` checks this. |
| X8 | Asks more than one question. |
| X9 | Quotes an Original that isn't word for word in the source. |
| X10 | Leaves out a required field (severity, where, original, issue with rule, rewrite) in any finding, or leaves out Summary or Reviewed scope. |
| X11 | Files a suggestion without an `Assumes` line, or files a Pref-only item as a confirmed problem. |
| X12 | Cites a line number where the quoted text isn't. |

## Results log

Record each run: date, skill change, must-catch hits, nice-to-catch score, any
must-not hit.

The 2026-11-10 runs didn't use `claude -p`, which couldn't authenticate in that
shell. Each ran as a Claude Code subagent, in the same kind of temporary folder,
told to read the installed `SKILL.md`, follow it with `bad-copy-app` as the argument,
and read nothing outside that folder.

| Date | Skill version | Must catch | Nice to catch | Must not | Notes |
|------|---------------|------------|---------------|----------|-------|
| 2026-11-10 | draft 1 (run A, Opus) | 18/18 | 10/10 | none | 15 of 23 findings rated major. Several unrelated strings folded into one finding. One code snippet compressed. |
| 2026-11-10 | draft 1 (run B, Sonnet) | 18/18 | 9/10 (missed N7) | none | 15 of 23 rated major, with a different blocker than run A. |
| 2026-11-10 | draft 2: severity anchors and calibration, one problem per finding, exact snippets (run C, Opus) | 18/18 | 10/10 | none | 10 major, 15 minor, 2 nit. Hedged the save-error cause correctly. |
| 2026-11-10 | draft 2 (run D, Sonnet) | 18/18 | 8/10 (missed N7, N8) | X12 | Cited `index.html:47` for text on line 48. Stated "storage is full" as fact for a catch-all error. Led to the line-number and ERR-5 rules. |
| 2026-11-10 | draft 2 + fixes (run E) | n/a | n/a | n/a | Stopped: several heuristic examples reused the fixture's own strings, which would have inflated the score. Examples replaced before runs F and G. |
| 2026-11-10 | draft 3: examples moved to other domains (run F, Sonnet) | 18/18 | 8/10 (missed N7, N8) | X12 | Cited the `Next` buttons at 16, 22, 27 instead of 16, 21, 26. Led to the grep-each-Original check. |
| 2026-11-10 | draft 3 (run G, Opus) | 18/18 | 10/10 | none | 9 major, 15 minor, 3 nit. All cited lines correct. |
| 2026-11-10 | v0.1: draft 3 + grep check for lines (run H, Sonnet) | 18/18 | 8/10 (missed N6, N7) | none | 7 major, 16 minor, 2 nit. All cited lines correct. One rewrite puts the date format only in a placeholder. |
| 2026-11-11 | v0.1 (desktop Code session in a temp folder, typed `/content-design-review bad-copy-app`) | 18/18 | 10/10 | none | 10 major, 11 minor, 1 nit confirmed; 3 suggestions. All checked lines correct. Filed "Let's Go!" (ACT-1) as an ACT-5 suggestion. Its one question (sighting or observation) was already settled by its own analysis. |
