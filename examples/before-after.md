# Before and after

Three small rewrites of the kind the skill suggests. The apps are made up. Each
rewrite uses only facts the imagined source confirms.

## 1. A destructive confirmation

A project tool. Deleting a project removes its tasks too, and the code has no
restore.

**Before**

> Are you sure?
>
> [ Yes ] [ No ]

**After**

> Delete "Website relaunch"?
>
> Its 14 tasks will be deleted too. You can't undo this.
>
> [ Delete project ] [ Keep project ]

**Why**

- The question names the action and the object, so it makes sense on its own
  (ACT-2).
- The second line states the consequence. The task count and "can't undo" come from
  the code. Without them, leave the line out (ERR-5).
- Each button says what it does. "Yes" and "No" only work if someone reads the
  question first (ACT-1, ACT-2).

## 2. A form error

A sign-up form. The validation rejects passwords shorter than 12 characters.

**Before**

> ❌ Invalid password! You entered a password that doesn't meet our requirements.

**After**

> Use at least 12 characters for your password.

**Why**

- "You entered…" puts the fault on the person. The new line just says what to do
  (ERR-3).
- "Doesn't meet our requirements" hides the rule. The new line names the field and
  states the one rule the code checks, and no other (ERR-4).
- The ❌ and the exclamation mark add alarm to a routine fix (ERR-6, a preference).

## 3. An empty state

A reading-list app on its first launch. A `+` button in the header, with
`aria-label="Add book"`, adds a book.

**Before**

> Nothing here yet.

**After**

> No books yet
>
> Add a book you're reading or want to read. It will show up here.
>
> [ Add book ]

**Why**

- "Nothing here" doesn't say what belongs here. "No books" uses the product's own
  term (EMP-1).
- The new text and button give the next step, using an action that already exists
  (EMP-2).
- The button label matches the header button's accessible name, "Add book", so
  there's one name for the action (TERM-2, A11Y-1).

Tone note: a warmer line such as "Your shelf is waiting" might suit this app. That's
a voice choice, so the skill would file it as a suggestion with its assumption,
not as a problem (TONE-4).
