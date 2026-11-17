## v0.2 — 2026-11-17

Quieter reviews. Tested on 500 random PostHog UI strings (3 runs).

- **Drop gate.** Before filing, the skill rereads its own reasoning. If it says the copy works in context, the cost is small, or the rewrite equals the original, the finding is dropped. No more softening weak cases into suggestions.
- **Narrow context check.** "The surrounding UI already explains it" now applies only to generic button labels and link text (ACT-1, ACT-3). Empty states and errors no longer get waved through. PLAIN-1 names the audience before calling a term jargon.
- **Always filed.** Terminology clashes (two names for one thing) and generated validation messages people can see.
- **One finding per pattern** for generated validator messages, with the fix pointed at the error mapping, not each string.

Result: flagged strings went from 7.8% (v0.1, one run) to an average of 4.6% (range 3.6–5.6%, three runs, repeats of the same validator message counted once).
