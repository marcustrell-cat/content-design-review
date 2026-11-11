# Sprig

A tiny static demo app for tracking when you last watered each of your plants. Open
`index.html` in a browser. There's no build step, no backend and no account. Plants
are stored in the browser's `localStorage`, on this device only, and nothing is
uploaded.

## Who it's for

People with a few houseplants who forget when they last watered them. Most use it on
a phone.

## Files

| File | What it holds |
|------|---------------|
| `index.html` | All screens: welcome, plant list, add form, delete dialog, toast |
| `app.js` | Screen switching, validation, saving, watering, deleting, CSV download |
| `styles.css` | Layout and basic styling |

## User flow

1. **First visit: welcome.** One screen that says what the app does and where plants
   are saved. One button opens the add form, the other opens the list. Either one
   marks the welcome as seen, so it only shows once.
2. **List (empty).** With no plants saved, the list says so and offers a button that
   opens the add form. The header has the same button.
3. **Add a plant.** The form has three fields: plant name, days between waterings and
   notes. Name and days are required. Notes are optional.
4. **Validation.** On submit, the app checks that the name isn't empty and that the
   days field is a whole number from 1 to 60. Each failing field shows its own
   message, and focus moves to the first one.
5. **Save.** A valid plant is saved, the list opens and a toast confirms. A new plant
   starts as not watered yet. If the browser refuses to save (for example, storage
   is full or blocked), the form stays open with what was typed and shows an error.
6. **Leave the form.** The second button on the form returns to the list without
   saving. The form is cleared the next time it opens.
7. **List.** Each plant shows how often to water it, when it was last watered and
   any notes. A button sets the last-watered date to today, and a toast confirms.
8. **Delete.** Each plant has a delete button. It opens a confirmation dialog.
   Confirming deletes the plant from storage for good. There's no undo. A toast
   confirms.
9. **Download.** A header button downloads all plants as `plants.csv`. It's hidden
   while the list is empty.
10. **Failures.** If saved plants can't be read, the app skips the welcome screen,
    and the list shows an error with a reload button instead of the empty state. If
    watering or deleting can't be saved, the change is rolled back and a message
    under the header says so.

## Running it

Open `index.html` in any modern browser. On macOS:

```bash
open index.html
```

To see the welcome screen again, clear the site's storage.
