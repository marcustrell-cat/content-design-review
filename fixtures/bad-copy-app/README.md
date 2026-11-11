# Field Log

A tiny static demo app for logging bird sightings. Open `index.html` in a browser.
There's no build step, no backend and no account. Sightings are stored in the
browser's `localStorage`, on this device only.

## Who it's for

Hobby birders who want a quick log on their phone while they're outdoors.

## Files

| File | What it holds |
|------|---------------|
| `index.html` | All screens: onboarding, list, add form, delete dialog, toast |
| `app.js` | Screen switching, validation, saving, deleting, CSV export |
| `styles.css` | Layout and basic styling |

## User flow

1. **First visit: onboarding.** Four steps, one after another. Each step has a
   single button that moves to the next one. The last step's button opens the list.
   Finishing onboarding is remembered, so it only shows once.
2. **List (empty).** With no sightings saved, the list shows a short message.
   The header has an export button and an add button.
3. **Add a sighting.** The add button opens a form with four fields: species, date,
   location and notes. Species and date are required. Location and notes are
   optional.
4. **Validation.** On submit, the app checks that species isn't empty, that the date
   is in `YYYY-MM-DD` format, and that a location, if given, is
   `latitude, longitude` in decimal degrees. The first failing check shows a message
   under the fields.
5. **Save.** A valid sighting is saved to `localStorage`, the form clears, the list
   opens and a toast confirms. If the browser refuses to save (for example, storage
   is full), the form stays open with what was typed and shows an error.
6. **Leave the form.** The second button on the form clears it and returns to the
   list.
7. **Delete.** Each sighting in the list has a delete button. It opens a
   confirmation dialog. Confirming removes the sighting from storage for good.
   There's no undo. A toast confirms.
8. **Export.** The export button downloads all sightings as `sightings.csv`. With no
   sightings, it shows a browser alert instead.

## Running it

Open `index.html` in any modern browser. On macOS:

```bash
open index.html
```

To see onboarding again, clear the site's storage.
