# content-design-review

A Claude Code skill that reviews the microcopy in an app's source code: buttons,
links, errors, empty states, onboarding, tone, terminology and accessible labels.

It's built for apps made quickly or with AI help, where the code works but the words
were never reviewed. It reads the UI source, checks each string against a set of
generic heuristics, and reports what to change. It doesn't edit anything unless you
ask.

**Status:** v0.1. English UI text only. See [Limitations](#limitations).

## What you get

Each finding has a severity, a location, the original text, the rule it breaks and a
rewrite you can paste:

```markdown
### F3 · major · ERR-3, ERR-4 · Date error blames and hides the format
- **Where:** `app.js:123` · `validate()` date check
- **Original:** "ERROR: You entered an invalid date!!"
- **Issue:** Blames the person and doesn't say which format works (ERR-3, ERR-4).
- **Rewrite:** "Enter the date as YYYY-MM-DD, for example 2026-05-14."
```

Findings come in two groups:

- **Confirmed problems**: usability failures you can show from the source.
- **Suggestions**: voice and style choices that depend on your audience. Each one
  states what it assumes.

The report ends with a short summary and the scope it covered. The full format is in
[`output-format.md`](skill/ux-copy-review/references/output-format.md).

## Install

Install it as a project skill. From the root of the project you want to review:

```bash
git clone https://github.com/marcustrell-cat/content-design-review.git /tmp/content-design-review
```

```bash
mkdir -p .claude/skills && cp -R /tmp/content-design-review/skill/ux-copy-review .claude/skills/content-design-review
```

That gives you:

```
your-project/
└── .claude/skills/content-design-review/
    ├── SKILL.md
    └── references/
        ├── heuristics.md
        └── output-format.md
```

In this repository the skill lives in `skill/ux-copy-review/`. Install it under the
name `content-design-review` so the folder name, the skill's `name` field and the
command all match.

To use it in every project, copy it to `~/.claude/skills/content-design-review/`
instead.

To check the install, type `/` in Claude Code and look for `content-design-review`.
If it isn't listed, restart the session.

## Use

Review the whole app:

```
/content-design-review
```

Review one area:

```
/content-design-review src/components/checkout
```

You can also ask in plain words, such as "review the copy on the sign-up screen".
Claude loads the skill when the request matches its description.

To run it non-interactively, for example in CI:

```bash
claude -p "/content-design-review src"
```

After the report, ask for changes by finding ID, such as "apply F1, F3 and F4". The
skill doesn't edit files until you do.

### Give it your voice

The skill doesn't assume a house style. If your project has a style guide, glossary
or voice notes (for example `docs/voice.md` or `glossary.md`), the skill reads them,
and they override its defaults. Without them, it judges whether the tone fits each
moment and files voice changes as suggestions.

## What it checks

| Group | Covers |
|-------|--------|
| ACT | Button and link labels, destructive confirmations, success messages |
| ERR | What went wrong, how to recover, no blame, field rules |
| EMP | What goes here and the next step, first use vs. no results vs. failure |
| ONB | Step length, skipping, claims that match the product, permission asks |
| TERM | One name per concept, one verb per action, instructions that match labels |
| TONE | Tone that fits the stakes, no shouting, steady form of address |
| A11Y, PLAIN | Accessible names, real labels, announced messages, jargon, formats |

Each check is either **Hard** (a usability failure) or **Pref** (a preference). Only
Hard checks become confirmed problems. The rules and examples are in
[`heuristics.md`](skill/ux-copy-review/references/heuristics.md).

Out of scope: visual design, color contrast, layout, code quality, legal review and
translation quality.

## Repository layout

```
.
├── README.md
├── LICENSE
├── skill/ux-copy-review/          # the skill (install as content-design-review)
│   ├── SKILL.md
│   └── references/
│       ├── heuristics.md          # the checks, with examples
│       └── output-format.md       # finding fields and report template
├── examples/before-after.md       # three rewrites with reasons
├── fixtures/
│   ├── bad-copy-app/              # tiny static app with weak copy
│   ├── good-copy-app/             # tiny static app whose copy already works
│   └── warm-copy-app/             # the same app with a warm, playful voice
└── tests/
    ├── bad-copy-checklist.md      # what a run must catch, and how to run it
    ├── good-copy-checklist.md     # false-positive test: what a run must not flag
    └── warm-copy-checklist.md     # false-positive test for voice suggestions
```

## Test

There are three fixtures, and a change to the skill should pass all of them:

- `fixtures/bad-copy-app/` is a small static app with deliberately weak copy.
  [`tests/bad-copy-checklist.md`](tests/bad-copy-checklist.md) lists what a run must
  catch, what it may catch, and what it must never do, such as inventing features.
- `fixtures/good-copy-app/` is a small static app whose copy already follows the
  heuristics. [`tests/good-copy-checklist.md`](tests/good-copy-checklist.md) counts
  every finding as a false positive. A run passes with no major findings and at
  most two minor ones.
- `fixtures/warm-copy-app/` is the same app with a warm, playful voice in its
  low-stakes moments. [`tests/warm-copy-checklist.md`](tests/warm-copy-checklist.md)
  checks that the skill leaves a voice that suits its audience alone, with the same
  pass rule.

Each checklist has a run command that reviews a temporary copy, so the skill can't
read the expected answers.

## Limitations

- The heuristics are written for English UI text.
- It reviews strings in source and locale files. It can't see text built on a
  server at runtime, text inside images, or emails it can't find in the repo.
- Like any model output, results vary between runs. Treat the report as a review
  from a careful colleague, not a test suite.
- On large codebases, give it a target folder.

## License

[MIT](LICENSE)
