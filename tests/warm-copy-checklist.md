# Fixture test: `fixtures/warm-copy-app`

A false-positive test for the Pref checks. `warm-copy-app` is the same Sprig app as
`good-copy-app`, with the same code and the same plain copy where the stakes are high.
The low-stakes moments (welcome, empty state, notes hint, success toasts) speak in
a warm, playful voice. The project has no voice guide, so the skill has to judge the
voice on its own.

Warmth is a voice choice, not a defect. This test checks that the skill leaves a
consistent voice that suits its audience alone, instead of flattening it into plain
copy. It's the partner of [`good-copy-checklist.md`](good-copy-checklist.md): the two
fixtures differ only in voice.

## Run

From the repository root:

```bash
tmp="$(mktemp -d)" && cp -R fixtures/warm-copy-app "$tmp/" && mkdir -p "$tmp/.claude/skills" && cp -R skill/ux-copy-review "$tmp/.claude/skills/content-design-review" && (cd "$tmp" && claude -p "/content-design-review warm-copy-app" > review.md) && diff -r fixtures/warm-copy-app "$tmp/warm-copy-app" && diff -r skill/ux-copy-review "$tmp/.claude/skills/content-design-review" && echo "No files changed. Review: $tmp/review.md"
```

If `claude -p` can't authenticate in your shell, use the manual steps in
[`good-copy-checklist.md`](good-copy-checklist.md#run). Run it at least twice.

## Pass rule

Count every finding, confirmed or suggested, as in the good-copy test.

- No `blocker` or `major` findings.
- At most 2 `minor` findings.
- `nit` findings don't fail the run, but count them and log them.
- The must-not items below don't happen, and neither do the bad-copy test's X5, X7,
  X8, X9, X10, X11 and X12.

## Must not

| # | Failure |
|---|---------|
| W1 | Files a confirmed (Hard) problem against a warm line in a low-stakes moment, for example TONE-1 for "Nice work." on a success toast. |
| W2 | Calls the voice inconsistent (TONE-3 or TONE-4) because errors and the delete dialog are plainer than the welcome. Tone is meant to shift with the moment. |
| W3 | Suggests adding warmth, jokes or emoji to an error, the load failure or the delete dialog. |
| W4 | Rewrites a warm line into plain copy without naming a concrete cost to the person, such as confusion or a hidden meaning. |

## Scoring

Use the causes in [`good-copy-checklist.md`](good-copy-checklist.md#scoring)
(misread, overreach, taste, real). A voice suggestion whose only argument is "a
general audience may find this too casual" is **taste**: the README says who the app
is for.

## What the copy does on purpose

For the scorer, not the skill.

| Where | Copy | Why it passes |
|-------|------|---------------|
| `index.html:13` | "Hello, plant person 🌱" | A greeting for a hobby app. The emoji is `aria-hidden`, so a screen reader skips it (A11Y-3). |
| `index.html:14-15` | "…how often they like a drink. It'll remember when you last watered each one, so you don't have to." / "Everything stays in this browser, on this device only." | About 35 words, one idea (ONB-1). Both claims are true (ONB-3). The idiom sits next to the plain word "watered". |
| `index.html:33` | "Add one, and Sprig will remember when it last had a drink." | Says what appears and gives the next step (EMP-1, EMP-2). "Had a drink" echoes the welcome screen, and the line promises only what the app does: remember the date (ONB-3). The button below says `Add plant`. |
| `index.html:63` | "Where it sits, how it's doing, anything worth remembering." | Example notes for an optional field. It states no rule. |
| `app.js:252` | "Give your plant a name so you can spot it in your list." | Names the field and the reason, without blame (ERR-3, ERR-4). Warm but still an instruction. |
| `app.js:296` | "Welcome, Monstera! It's on your list now." | Says what happened (ACT-6). One exclamation mark, not stacked (TONE-2). |
| `app.js:171` | "Monstera has been watered. Nice work." | Says what happened, using the button's word "watered" (ACT-6, TERM-2). |
| `index.html:38`, `76-80`; `app.js:165`, `197`, `202`, `291` | Load failure, delete dialog, delete toast and every error | Plain on purpose, because data is at stake (TONE-1). Same text as `good-copy-app`. |
| Everywhere else | Labels, hints, list lines | Same as `good-copy-app`. |

## Results log

Record each run: date, skill version, model, the counts, any must-not hit, and each
false positive with its rule and cause.

The counts include every finding, even ones scored "real". These runs used Claude
Code subagents in temporary folders, as in the other logs.

| Date | Skill version | Blocker / major | Minor | Nit | Must not | False positives (rule, cause) |
|------|---------------|-----------------|-------|-----|----------|-------------------------------|
| 2026-11-11 | v0.1, first fixture draft (run M, Opus) | 0 | 2 | 0 | none | PLAIN-1, real: "Download list (CSV)" didn't say what the file is. Changed to "Download spreadsheet (CSV)" in both Sprig fixtures, since four good-copy runs had weighed the same label and declined. ONB-3, real: "keep an eye on its watering" implied reminders the app doesn't have. Changed to "remember when it last had a drink". No voice suggestions. One question (whether reminders are planned). |
| 2026-11-11 | v0.1, first fixture draft (run N, Sonnet) | 0 | 2 | 0 | none | The same two findings, reached independently. No voice suggestions. One question (whether reminders are planned). |
| 2026-11-11 | v0.1, fixture with both fixes (run Q, Opus) | 0 | 0 | 0 | none | None. Said "No suggestions" because changing the warm lines would impose a voice. One question (whether a voice guide exists). |
| 2026-11-11 | v0.1, fixture with both fixes (run R, Sonnet) | 0 | 0 | 2 | none, W4 close | TONE-4, taste, twice, filed in case the voice wasn't deliberate. One rewrote "Monstera is watered for today. Nice work." to the plain good-copy toast (the wording was clumsy, so the fixture now says "has been watered"). The other rewrote "Welcome, Monstera! It's on your list now." to "Monstera added to your list." Its question said to drop both if the voice is deliberate. Led to the cost rule for Pref checks. |
| 2026-11-11 | v0.1 + Pref cost rule, toast now "has been watered" (run W, Opus) | 0 | 1 | 0 | none | ACT-6, overreach: "Not watered yet" on a new plant reads as a fact the app can't know. But the person has just added the plant, and the same string passed all eight good-copy runs. Left in the fixture. No voice suggestions, no question. |
| 2026-11-11 | v0.1 + Pref cost rule, same fixture (run Y, Sonnet) | 0 | 0 | 0 | none | None. Said "No suggestions": the warm voice is consistent, suits the audience and stays out of high-stakes moments. No question. |

All six runs pass. Before the cost rule, Sonnet filed two voice nits in case the voice
wasn't deliberate (run R). After it, run Y filed none. Opus left the voice alone in
every run.
