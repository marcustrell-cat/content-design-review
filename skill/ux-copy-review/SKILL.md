---
name: content-design-review
description: Reviews UI microcopy in an app's source code (buttons, links, errors, empty states, onboarding, tone, terminology, accessible labels). Reports each finding with severity, file and line, the original text, the rule it breaks and a concrete rewrite. Use when asked to review UX copy, microcopy or UI text, or to check the wording of an AI-built app. Read-only unless asked to edit.
argument-hint: "[path or area to review]"
allowed-tools: Read, Grep, Glob
---

# Content design review

Review the words in this app's interface and report what to change. Don't change
anything.

**Target:** $ARGUMENTS

If the target is empty, review the app's main user-facing source.

## Ground rules

- **Read only.** Don't create, edit, move or delete files during the review. After
  the report, edit only if the person asks, and only the strings they name.
- **Microcopy only.** Review text a user sees or hears: labels, messages, headings,
  helper text, accessible names, alt text. Leave visual design, color contrast,
  layout, code quality and legal wording out of scope.
- **Facts come from the source.** Rewrites may state only what the code, the project
  docs or the person confirms. Read what a handler actually does before you rewrite
  its label or its error. When a fact is missing, use a `[placeholder]` and log it.
- **No universal voice.** If the project has a style guide, glossary or voice notes,
  follow them. Otherwise judge fit for the moment, and treat voice as a suggestion.
- **Separate failures from preferences.** A Hard check failure is a confirmed
  problem. A Pref check is a suggestion with its assumption stated.

## Steps

1. **Set the scope.** Use the target above. With no target, find the UI source
   (`Glob` for `**/*.{html,jsx,tsx,vue,svelte}`, templates and locale files). Skip
   tests, mocks, stories and build output unless they are inside the target. If there
   are more than about 40 UI files and no target, ask which area to review first.
2. **Gather context.** Read the README and any product docs, style guide, glossary or
   voice notes in or above the target (for example files matching `*voice*`,
   `*tone*`, `*glossary*`, `*style*`, `CONTENT*`). Note the audience and platform.
   Don't stop to ask yet.
3. **Collect the strings.** Read each UI file in full, not just grep hits, so you
   know what each string does. Cover:
   - visible text, button and link labels, headings and helper text
   - `aria-label`, `alt`, `title`, `placeholder` and `<label>`
   - validation messages, `alert()`, `confirm()`, toasts and `catch` blocks
   - empty, loading and error branches, onboarding and welcome flows
   - locale files (`*.json`, `*.yaml`, `*.strings`, `*.po`, `*.arb`) and strings set
     through `textContent` or `innerHTML`
4. **Trace behavior.** For each string that promises or explains something, check the
   code behind it: what the button does, what validation accepts, whether a delete
   can be undone, what is kept when a save fails.
5. **Run the checks.** Load [references/heuristics.md](references/heuristics.md) and
   apply every group: ACT, ERR, EMP, ONB, TERM, TONE, A11Y and PLAIN. For TERM, list
   every name used for each core object and action, with locations, before judging.
6. **Classify.** Mark each finding as confirmed (Hard) or suggestion (Pref). Give it
   a severity from the guide in `heuristics.md`, then run that guide's calibration
   check.
7. **Write the report.** Follow
   [references/output-format.md](references/output-format.md) exactly, then run its
   "Before you send" checks.

## Missing context

- By default, keep going and state what you assumed.
- Ask one focused question only when you can't tell what to review, or when the
  answer would change what counts as a problem (for example, whether users are
  domain experts). Ask a scope question before reading. Put any other question at
  the end of the report.
- Never ask more than one question in a review.

## After the report

Offer to apply chosen rewrites by ID (for example "apply F1 to F4"). Don't apply
anything until the person says so.
