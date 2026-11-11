# Fixture test: `fixtures/good-copy-app`

A false-positive test for the skill. `good-copy-app` ("Sprig") is a small app whose
copy already follows the heuristics. Run the review against it and count every
finding as a false positive.

The bad-copy test ([`bad-copy-checklist.md`](bad-copy-checklist.md)) shows the skill
catches real problems. This one shows it doesn't invent problems to fill a report.
[`warm-copy-checklist.md`](warm-copy-checklist.md) runs the same app with a warm
voice, to show the skill doesn't flatten a voice that suits its audience. Run all
three after any change to the skill.

## Run

From the repository root:

```bash
tmp="$(mktemp -d)" && cp -R fixtures/good-copy-app "$tmp/" && mkdir -p "$tmp/.claude/skills" && cp -R skill/ux-copy-review "$tmp/.claude/skills/content-design-review" && (cd "$tmp" && claude -p "/content-design-review good-copy-app" > review.md) && diff -r fixtures/good-copy-app "$tmp/good-copy-app" && diff -r skill/ux-copy-review "$tmp/.claude/skills/content-design-review" && echo "No files changed. Review: $tmp/review.md"
```

It works like the bad-copy run: a fresh copy, a headless review, then a `diff` to
check that nothing changed. If `claude -p` can't authenticate in your shell, set up
the same folder, start `claude` in it, type `/content-design-review good-copy-app`
and run the `diff` by hand.

The model isn't deterministic, so run it at least twice before calling a change to
the skill good or bad.

## Pass rule

Count every finding, confirmed or suggested.

- No `blocker` or `major` findings.
- At most 2 `minor` findings.
- `nit` findings don't fail the run, but count them and log them.
- These must-not items from the bad-copy test still apply: X5 (invented support
  link), X7 (changed a file), X8 (more than one question), X9 (misquoted Original),
  X10 (missing field or section), X11 (Pref filed as confirmed, or suggestion with no
  `Assumes`) and X12 (wrong line number).
- When there are no confirmed problems, the report says so in one line. It doesn't
  pad the section.

## Scoring

Give each finding one cause:

| Cause | Meaning |
|-------|---------|
| misread | The finding gets the copy or the code wrong, for example calls an announced message silent. |
| overreach | A Hard check applied where its condition doesn't hold, for example a generic-label failure for a label that names its result. |
| taste | A Pref item with no concrete cost to the person: a rewording, not a fix. |
| real | You agree it's a problem. Fix the fixture, note it in the log, and don't count it against the skill. |

Tune the skill for misread, overreach and taste. Use "real" sparingly: it means the
fixture was wrong, not that the finding was clever.

## What the copy does on purpose

For the scorer, not the skill. Each row is a choice a reviewer might question, and
the check it meets.

| Where | Copy | Why it passes |
|-------|------|---------------|
| `index.html:13-18` | One welcome screen, about 30 words, `Add your first plant` / `Skip for now` | One idea, skippable (ONB-1, ONB-2). The storage line is true (ONB-3). When saved plants can't be read, the app skips this screen (`app.js:305`), so `Add your first plant` always opens the form (ACT-4). |
| `index.html:26` | `Download spreadsheet (CSV)` | Says what you get in plain words, and "(CSV)" names the format for anyone who needs it (ACT-1, PLAIN-1). Hidden while the list is empty. |
| `index.html:27`, `index.html:34` | `Add plant` | One label for one action (TERM-2). The `+` is `aria-hidden` (A11Y-1). |
| `index.html:32-34` | "No plants yet" plus a next step and a button | EMP-1, EMP-2. |
| `index.html:38-40` | "Couldn't load your plants" state | Told apart from the empty state (EMP-3). "If that doesn't work, check…" is advice, not a stated cause (ERR-5). |
| `index.html:51-62` | Visible labels, a range hint, "(optional)" on notes | A11Y-2, PLAIN-2. |
| `app.js:252`, `app.js:255` | "Enter a plant name." / "Enter a whole number from 1 to 60." | Name the field and the rule that `validate()` checks, without blame (ERR-3, ERR-4). |
| `index.html:52`, `58`, `65`; `app.js:276` | `role="alert"` on errors, and focus moves to the first invalid field | Announced (A11Y-4). |
| `index.html:67`; `app.js:291`, `296` | `Save plant` / "Couldn't save this plant." / "Monstera saved." | One verb for committing the form (TERM-2). `Add plant` opens the form; `Save plant` commits it. |
| `app.js:291` | The save error | Says what happened, what's kept and what to try (ERR-1, ERR-2). The form keeps its values. |
| `index.html:68` | `Cancel` | Returns to the list without saving (ACT-4). |
| `index.html:75-79`; `app.js:178` | "Delete Monstera?" / "You can't undo this." / `Delete plant` / `Keep plant` | ACT-2. "Can't undo" matches the code. Focus starts on `Keep plant`. |
| `app.js:171`, `202`, `296` | Toasts name the plant and what happened | ACT-6. The toast has `role="status"` (`index.html:83`). |
| `app.js:165`, `app.js:197` | "Couldn't mark Monstera as watered. Try again, or check…" / "Couldn't delete Monstera. Try again, or check…" | ERR-1, ERR-2. The change is rolled back, so trying again is safe. Same advice as the form's save error. |
| `app.js:94-102` | "Water every day" / "Water every 7 days", "Last watered yesterday" | Singular and plural handled. |
| `app.js:142-143` | `Mark as watered` and `Delete` in each card | Visually hidden text adds the plant name for screen readers (A11Y-1). |
| Everywhere | "plant", "you" and "your", sentence case, no exclamation marks | TERM-1, TONE-2, TONE-3. |

## Results log

Record each run: date, skill version, model, the counts, and each false positive with
its rule and cause.

The counts include every finding, even ones scored "real". The 2026-11-11 runs didn't
use `claude -p`, which couldn't authenticate in that shell. Each ran as a Claude Code
subagent in a temporary folder, the same way as the 2026-11-10 bad-copy runs.

| Date | Skill version | Blocker / major | Minor | Nit | Must not | False positives (rule, cause) |
|------|---------------|-----------------|-------|-----|----------|-------------------------------|
| 2026-11-11 | v0.1, first fixture draft (run I, Opus) | 0 | 1 | 0 | none | ERR-2, real: the watering and delete errors stopped at "Try again", while the form's save error for the same failure also said what to check. Fixture fixed. It also noticed, without filing, that CSV dates were in UTC while the list counts local days. That was a code bug, also fixed. No suggestions. One question (whether users know "CSV"). |
| 2026-11-11 | v0.1, first fixture draft (run J, Sonnet) | 0 | 1 | 0 | none | ACT-4, real: when saved plants couldn't be read, "Add your first plant" opened the list instead of the form. Fixture fixed: a load failure now skips the welcome screen. No suggestions, no question. |
| 2026-11-11 | v0.1, fixture with both fixes (run K, Opus) | 0 | 0 | 0 | none | None. Said "No confirmed problems" and "No suggestions" in one line each. Considered "(CSV)" and the load-error wording and explained why it didn't file them. No question. |
| 2026-11-11 | v0.1, fixture with both fixes (run L, Sonnet) | 0 | 0 | 0 | none | None. Also considered "(CSV)" and didn't file it. No question. |
| 2026-11-11 | v0.1, download label changed to "Download spreadsheet (CSV)" after the warm-copy runs (run O, Opus) | 0 | 0 | 0 | none | None. No question. |
| 2026-11-11 | v0.1, same fixture (run P, Sonnet) | 0 | 0 | 0 | none | None. One question: can saved data become unreadable? If so, the load error would need to say what happens to it. |
| 2026-11-11 | v0.1 + Pref cost rule (run U, Opus) | 0 | 0 | 0 | none | None. No question. |
| 2026-11-11 | v0.1 + Pref cost rule (run V, Sonnet) | 0 | 0 | 0 | none | None. No question. |

All eight runs pass, and the Pref checks never filed anything here. The Pref cost rule
came from the warm-copy test ([`warm-copy-checklist.md`](warm-copy-checklist.md)).
Runs U and V show it didn't change this result.
