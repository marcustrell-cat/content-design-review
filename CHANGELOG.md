## Unreleased

- **Tighter context check.** The surrounding text clears an ACT-1 or ACT-3 label only when it says what the control does, and to what. A heading that only names the screen, or text that only says to press the button, doesn't count. The check never clears a control that saves, sends, confirms, deletes or pays. In the v0.2 fixture tests, a Sonnet run used the old wording to clear the bad-copy fixture's `Submit` (a must-catch item) and "Let's Go!". With the new wording, all seven re-runs pass: bad copy 18/18 on Opus and on two Sonnet runs, and no findings on the good-copy and warm-voice fixtures.

## v0.2 — 2026-11-17

Quieter reviews. Tested on 500 random PostHog UI strings (3 runs).

- **Drop gate.** Before filing, the skill rereads its own reasoning. If it says the copy works in context, the cost is small, or the rewrite equals the original, the finding is dropped. No more softening weak cases into suggestions.
- **Narrow context check.** "The surrounding UI already explains it" now applies only to generic button labels and link text (ACT-1, ACT-3). Empty states and errors no longer get waved through. PLAIN-1 names the audience before calling a term jargon.
- **Always filed.** Terminology clashes (two names for one thing) and generated validation messages people can see.
- **One finding per pattern** for generated validator messages, with the fix pointed at the error mapping, not each string.

Result: flagged strings went from 7.8% (v0.1, one run) to an average of 4.6% (range 3.6–5.6%, three runs, repeats of the same validator message counted once).
