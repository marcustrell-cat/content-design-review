# Microcopy heuristics

Generic checks for interface text: buttons, links, errors, empty states,
onboarding, tone, terminology, accessibility and plain language.

There is no universal voice. A tax tool, a game and a hospital portal should not
sound alike. These checks judge whether the words **work** for the person in that
moment. They don't enforce a house style. When the project has its own style guide,
glossary or voice notes, those win over anything here.

## How to read this file

Every check has an ID and a type:

- **Hard**: a usability failure you can show from the source. The person can't tell
  what will happen, can't recover, can't find the next step, can't perceive the
  control, or is told something that is not true. A Hard check can produce a
  **confirmed** finding at any severity.
- **Pref**: a preference that depends on audience, brand or product context. A Pref
  check can only produce a **suggestion**, at `minor` or `nit`, and the finding must
  name the context it assumes.

If you can't point to the text and explain the failure without "I'd prefer", it is
not Hard.

Examples are illustrations, not templates. Don't copy their wording into a review.
Write rewrites from the product's own facts.

---

## ACT: Action labels

Buttons, menu items and links are promises about what happens next.

| ID | Type | Check |
|----|------|-------|
| ACT-1 | Hard | The label says what happens. Generic labels ("OK", "Submit", "Proceed", "Continue", "Yes") fail when the result isn't obvious from the label alone. |
| ACT-2 | Hard | Destructive or irreversible actions name the action and the object ("Delete project"), and the confirm and cancel buttons can't be confused out of context. |
| ACT-3 | Hard | Link text makes sense on its own. "Click here", "Learn more" and "this link" fail when several sit on one page or when read by a screen reader. |
| ACT-4 | Hard | The label matches what the code does. A button labeled "Save" that also sends or publishes fails. |
| ACT-5 | Pref | Labels are short (about 1 to 4 words), start with a verb and use the same casing throughout. |
| ACT-6 | Hard | Success and status messages say what happened ("Project saved"). A bare "Done!" or "All set" fails when the message can appear out of context, such as a toast. Usually `minor`. |

**Examples**

- ACT-1. Weak: `Proceed` on a button that books an appointment. Better:
  `Book appointment`. The label now says what you get.
- ACT-2. Weak: "Confirm action" with `OK` / `Cancel` before removing a team member.
  Better: "Remove Dana from this team?" with `Remove member` / `Keep member`. Each
  button can be read without the question.
- ACT-3. Weak: "To change your plan, click here." Better: "[Change your plan]".
- ACT-4. Weak: `Save` on a form that also emails the client. Better: `Save and send`.
- ACT-5 (Pref). `Create A New Report Now` → `Create report`. Shorter, consistent
  casing. Treat it as a suggestion unless the project's style guide sets casing.
- ACT-6. Weak: a toast that says "Done!". Better: "Report shared with 3 people."
  Name the count only if the code knows it.

---

## ERR: Error messages

An error has done its job when the person knows what went wrong and what to do next.

| ID | Type | Check |
|----|------|-------|
| ERR-1 | Hard | Says what happened in words a user understands. A raw code, exception name or "Something went wrong" on its own fails. |
| ERR-2 | Hard | Says how to recover: what to change, what to try, or where to get help. If no recovery exists, it says what was and wasn't kept. |
| ERR-3 | Hard | Doesn't blame the person ("You entered…", "You forgot…", "Invalid…", "Illegal…") and doesn't call their input wrong without saying what's expected. |
| ERR-4 | Hard | Field errors name the field and the rule (format, length, range) that the code checks. Don't state a rule the code doesn't enforce. |
| ERR-5 | Hard | Doesn't claim facts the code doesn't support ("Your data is safe", "We've been notified", "Try again in 5 minutes"). This applies to rewrites too: if a `catch` handles every error, the message can't state one cause as fact. Say "may", or leave the cause out. |
| ERR-6 | Pref | Tone is calm. Jokes, emoji, "Oops" and exclamation marks are usually a poor fit when someone is blocked. This becomes Hard (TONE-1) when data may be lost. |

**Examples**

- ERR-1 + ERR-2. Weak: "Error 0x3F." Better: "Couldn't save your changes. Check
  your connection and try again." Only say "your changes are still here" if the code
  keeps them.
- ERR-3. Weak: "Illegal characters in username." Better: "Use only letters, numbers
  and underscores." State the characters the code actually allows.
- ERR-4. Weak: "Invalid password." Better: "Use at least 12 characters." Check the
  validation code for the real minimum.
- ERR-5. Weak: "Payment failed. Don't worry, you haven't been charged." Keep that
  sentence only if the code or docs confirm no charge happens. If they don't, leave
  it out or ask.

---

## EMP: Empty states

An empty screen is often the first thing someone sees. It should explain the space
and get them moving.

| ID | Type | Check |
|----|------|-------|
| EMP-1 | Hard | Says what will appear here, in the product's terms. A generic line such as "Nothing here" or "0 results" on its own fails. |
| EMP-2 | Hard | Offers the next step: an action that exists in the code, or how to make content appear. |
| EMP-3 | Hard | First use, "no search results" and "failed to load" are told apart. A load failure shown as "No items" misleads people. |
| EMP-4 | Pref | Tone and length suit the context. Some products want warmth here, others want one line. |

**Examples**

- EMP-1 + EMP-2. Weak: "Nothing to show." Better: "No invoices yet. Create your first
  invoice to see it here." plus a `Create invoice` button, if creating an invoice
  is possible from this screen.
- EMP-3. Weak: "No results" after a search for "zebra". Better: "No matches for
  'zebra'. Check the spelling or clear the filters."
- EMP-4 (Pref). "Your inbox is calm today ☀️" can suit a consumer app. Flag it only
  with the audience you assume.

---

## ONB: Onboarding

Onboarding should get someone to their first useful moment fast, then step aside.

| ID | Type | Check |
|----|------|-------|
| ONB-1 | Hard | Each step carries one idea someone can act on. A step that needs scrolling, or packs several features into one paragraph, fails. As a rough guide, more than about 40 words of body text on a step is too long. |
| ONB-2 | Hard | The person can skip or leave, and the way out is labeled clearly. A flow that forces every step before any value fails. |
| ONB-3 | Hard | Claims match the product. Promising a feature, integration, number of users or guarantee that the code and docs don't show fails, or at least needs confirming. |
| ONB-4 | Hard | When it asks for data or a permission, it says why at that moment. |
| ONB-5 | Pref | Number of steps, marketing tone and welcome language. Fewer is usually better, but how many depends on the product. |

**Examples**

- ONB-1. Weak: one step that explains five settings in a single paragraph. Better:
  "Track every project in one place." plus one sentence on the first action.
- ONB-2. Weak: six `Continue` steps in a row with no way out. Better: `Skip` on
  every step, and a final button that names the first action (`Create a project`).
- ONB-3. Weak: "Collaborate with your whole team" in an app with no sharing code.
  Better: remove the claim, or ask whether sharing is planned.
- ONB-4. Weak: a location prompt with no explanation. Better: "Allow location to
  fill in where you are. You can type it instead."

---

## TERM: Consistency and terminology

People learn a product's words. Changing them makes people think there are two
different things.

| ID | Type | Check |
|----|------|-------|
| TERM-1 | Hard | One concept has one name across the UI. If "project", "workspace" and "board" mean the same object, that fails. |
| TERM-2 | Hard | One action has one verb. "Delete" and "Remove" for the same effect fails. Different verbs are fine when the effects differ (for example "Archive" vs "Delete"). |
| TERM-3 | Hard | Instructions and help text use the exact labels on screen. "Tap Save" when the button says "Done" fails. |
| TERM-4 | Hard | When the project has a glossary or term list, the UI follows it. |
| TERM-5 | Pref | Which of the competing terms to keep. Pick the one already most used, or the one in the code's data model, and say why. Without a glossary, the choice is a suggestion. |

**Examples**

- TERM-1. Weak: the nav says "Clients", the form says "Add customer", the empty state
  says "No accounts". Better: one word everywhere. TERM-5 decides which one.
- TERM-2. Weak: a menu offers "Remove", the confirm dialog says "Delete", and both run
  the same function. Better: "Delete" in both places.
- TERM-3. Weak: "Click Publish to go live" when the button reads "Share". Better:
  match the button, or rename the button.

---

## TONE: Tone suited to context

Voice is the product's personality and stays fairly steady. Tone shifts with the
moment. Check fit, not taste.

| ID | Type | Check |
|----|------|-------|
| TONE-1 | Hard | Tone fits the stakes. Jokes, cheer or emoji fail where someone may lose data, money or access, or is dealing with something sensitive. |
| TONE-2 | Hard | No shouting: no ALL-CAPS sentences, no stacked exclamation marks, no "WARNING" for routine events. |
| TONE-3 | Hard | How the product speaks to people stays steady (for example "you" throughout, and one level of formality per language). |
| TONE-4 | Pref | Overall voice (playful, plain, formal, warm). Without a voice guide, suggest a change only with the audience you assume. Never impose a single "correct" voice. |

**Examples**

- TONE-1. Weak: "Yikes! Your card got rejected 😬" on a failed payment. Better:
  "Your card was declined. Try another card." A short, plain line fits when money is
  involved.
- TONE-2. Weak: "YOU MUST VERIFY YOUR EMAIL!!!" Better: "Verify your email to keep
  using your account."
- TONE-3. Weak: onboarding says "Hey friend!" while settings say "The user may
  configure…". Better: pick one way to address people.
- TONE-4 (Pref). "Let's get cooking!" on a recipe app may be on-brand. Note it only
  as a suggestion, with the assumption.

---

## A11Y and PLAIN: Accessibility and plain language

Words are part of accessibility. These checks cover text only, not color contrast or
layout.

| ID | Type | Check |
|----|------|-------|
| A11Y-1 | Hard | Icon-only buttons and links have an accessible name (`aria-label`, visually hidden text, `title` as a last resort) that says what they do. |
| A11Y-2 | Hard | Form fields have a real label. A placeholder alone fails: it disappears on input and is often skipped by assistive tech. |
| A11Y-3 | Hard | Meaning doesn't rely on color, emoji or an icon alone. Images that carry meaning have useful `alt` text, and decorative ones have `alt=""`. |
| A11Y-4 | Hard | Status and error messages that appear after an action can be announced (for example `role="alert"` or `aria-live`). Flag it when the copy is injected silently. |
| PLAIN-1 | Hard | Jargon, internal names and acronyms are explained or replaced when the audience isn't expert. Developer terms ("null", "payload", "sync token", "MIME type") in user-facing text fail. |
| PLAIN-2 | Hard | Required formats and units are stated: date format, currency, size limits, time zone. |
| PLAIN-3 | Pref | Sentences are short (about 25 words or fewer), in active voice, with the important part first. |

**Examples**

- A11Y-1. Weak: `<button><svg …/></button>` that closes a panel. Better:
  `<button aria-label="Close settings">`.
- A11Y-2. Weak: `<input placeholder="Name">`. Better: a visible `<label>Name</label>`
  tied to the input, with the placeholder used only for an example.
- PLAIN-1. Weak: "MIME type not allowed." Better: "This file type isn't supported.
  Upload a PDF or PNG." Name only the types the code accepts. Keep a technical term
  only for an expert audience you can name.
- PLAIN-2. Weak: "Upload a file" when the code rejects anything over 5 MB. Better:
  "Upload a PDF or PNG, up to 5 MB."

---

## Severity guide

| Severity | Use when |
|----------|----------|
| `blocker` | Someone can't complete a core task, or the copy makes a harmful or irreversible mistake likely and nothing else on screen prevents it. Rare: most reviews have none, or one or two. |
| `major` | On a main path, someone is likely to get stuck, make an error they can't easily fix, or be misled about what the product does. |
| `minor` | Someone can still finish with a little effort: extra reading, a guess they can check, a second try. |
| `nit` | Polish: casing, punctuation, small wording choices. |

Anchors:

- `blocker`: the only button that finishes checkout has no accessible name. A button
  labeled "Keep plan" that actually cancels the subscription.
- `major`: a password error that doesn't state the length rule the code checks. A
  team tool that calls one space "workspace" on one screen and "team" on the next.
- `minor`: "Continue" on a step whose heading already says what comes next. An
  unexplained acronym in a rarely used settings label. A two-sentence tooltip that
  could be one.

Hard checks may use any severity. Pref checks stop at `minor`. Rate severity by the
effect on the person, not by how easy the fix is.

**Calibrate before you write.** If more than half of the confirmed findings are
`major` or higher, check each one again against the table and anchors above. Keep a
rating if it still fits. Don't change ratings just to reach a ratio.

## Facts and assumptions

A rewrite may state only what the source, the project docs or the person you're
helping confirms: features, limits, formats, timings, policies, what is saved,
whether an action can be undone. When a good rewrite needs a fact you don't have:

1. Use a clear placeholder such as `[support link]` or `[N] days`, or
2. Write the rewrite without the claim, and
3. Log the gap under "Assumptions and open question".

Never fill a gap with a plausible-sounding guess.
