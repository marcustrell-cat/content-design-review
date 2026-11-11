# Output format

Write the review as Markdown in the chat. Don't write it to a file unless the person
asks.

## Finding fields

Every finding has these fields, in this order.

| Field | Required | What goes in it |
|-------|----------|-----------------|
| ID | yes | `F1`, `F2`… in report order. Lets the person say "apply F3". |
| Severity | yes | `blocker`, `major`, `minor` or `nit` (see the severity guide in `heuristics.md`). |
| Rule | yes | One or more check IDs from `heuristics.md`, for example `ERR-2, ERR-3`. |
| Title | yes | A few words naming the problem, not the fix. |
| Where | yes | `path/to/file.ext:line` plus the component, screen or element, for example `` `src/Form.jsx:42` · `<SignupForm>` email field ``. Add each place for repeated text. |
| Original | yes | The exact text as it appears in the source, in quotes. Keep typos, casing and punctuation. Show a short code snippet when the problem is markup, such as a missing label. |
| Issue | yes | One or two sentences: what fails for the person, and why, tied to the rule. |
| Rewrite | yes | Concrete replacement text, ready to paste. For markup issues, the corrected snippet. Use `[placeholder]` for any fact the source doesn't confirm. |
| Assumes | suggestions only | The audience, voice or product context the suggestion depends on. |

Rules for the fields:

- **Original** is quoted, never paraphrased. If the text is built at runtime, quote
  the template and say so, for example `` `"Delete " + name + "?"` (template) ``.
  Code snippets are copied exactly as they are, line breaks included. Don't
  compress or tidy them.
- **Rewrite** gives one option. Give a second only when the right choice depends on
  a fact you don't have, and say which fact.
- **Rewrite** must not add features, limits, timings or policies the source doesn't
  show.
- **Rewrite** changes text and text-bearing attributes. If the fix also needs new
  code, such as a skip button or a separate error branch, give the copy and add one
  line saying what code it needs.

One finding is one problem:

- Several rules broken by one string: one finding, with all the rule IDs.
- The same problem in several places: one finding, with several `Where` lines.
- Different problems in different strings: separate findings, even when they sit on
  the same screen. This keeps "apply F3" precise.
- Don't file the same text twice. If two findings touch one string, say so in the
  second ("see F2") and give one combined rewrite.

## Sections

The review has these sections, in this order:

1. **Confirmed problems**: Hard-check failures, sorted by severity, then by
   location.
2. **Suggestions**: Pref-check items. Each one has an `Assumes` line.
3. **Assumptions and open question**: the context you assumed, the facts you
   couldn't confirm, and at most one focused question.
4. **Summary**: counts by severity, then the two or three patterns behind most
   findings.
5. **Reviewed scope**: what you read, what you skipped and why, and what this review
   can't cover.

Leave out a section only if it would be empty, and say so in one line ("No
suggestions."). Never leave out Reviewed scope.

## Template

```markdown
# UX copy review: <area or path>

## Confirmed problems

### F1 · major · ERR-2, ERR-3 · Save error blames and gives no next step
- **Where:** `src/components/EditForm.tsx:58` · `<EditForm>` submit handler
- **Original:** "You broke something. Error 500."
- **Issue:** Blames the person and gives no next step (ERR-2, ERR-3).
- **Rewrite:** "Couldn't save your changes. Try again."

### F2 · minor · TERM-2 · "Remove" and "Delete" for the same action
- **Where:** `src/Menu.tsx:12` · row menu; `src/ConfirmDialog.tsx:7` · title
- **Original:** "Remove" / "Delete item?"
- **Issue:** Both run `deleteItem()`. Two verbs suggest two different effects (TERM-2).
- **Rewrite:** "Delete" / "Delete item?"

## Suggestions

### F3 · nit · TONE-4 · Playful greeting may not suit every audience
- **Where:** `src/Welcome.tsx:5` · heading
- **Original:** "Howdy, partner! 🤠"
- **Issue:** The voice is a product choice. This greeting reads as very casual.
- **Rewrite:** "Welcome back"
- **Assumes:** A general professional audience. Ignore this if the casual voice is intended.

## Assumptions and open question
- Assumed: <audience, platform, voice>.
- Not confirmed in source: <fact a rewrite would need>, so the rewrite uses a placeholder.
- Question: <one question whose answer would change the most findings>

## Summary
- 0 blocker · 1 major · 1 minor · 1 nit
- Patterns: <the two or three causes behind most findings>

## Reviewed scope
- Read: `src/components/` (12 files), `src/locales/en.json`
- Skipped: `src/tests/` (test strings, not user-facing)
- Not covered: strings sent by the server at runtime, text inside images, emails
```

## Before you send

- Every `Where` line is checked: Grep the file for a distinctive part of each
  Original and use the line number Grep returns. Never work out line numbers by
  counting or by the spacing between elements.
- Every `Original` appears word for word in that file.
- Every confirmed finding names a Hard check. Every suggestion names a Pref check
  and has `Assumes`.
- No rewrite states a fact you didn't find in the source or docs.
- At most one question.
- You changed no files.
