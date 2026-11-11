// Field Log: a tiny bird sighting log.
// All data lives in this browser's localStorage. There is no server, no account
// and no sync.

const STORAGE_KEY = 'fieldlog.sightings';
const ONBOARDED_KEY = 'fieldlog.onboarded';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;                       // YYYY-MM-DD
const COORDS_PATTERN = /^-?\d{1,2}(\.\d+)?,\s*-?\d{1,3}(\.\d+)?$/; // lat, long

let sightings = load();
let pendingDeleteId = null;

const $ = (id) => document.getElementById(id);
const screens = ['onboarding', 'main', 'form-screen'];

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sightings));
}

function esc(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showScreen(id) {
  for (const s of screens) $(s).hidden = s !== id;
}

function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.hidden = false;
  setTimeout(() => { el.hidden = true; }, 3000);
}

// ---------- Onboarding ----------

let step = 1;
document.querySelectorAll('#onboarding .next').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelector(`.step[data-step="${step}"]`).hidden = true;
    step += 1;
    document.querySelector(`.step[data-step="${step}"]`).hidden = false;
  });
});

$('finish-onboarding').addEventListener('click', () => {
  localStorage.setItem(ONBOARDED_KEY, 'yes');
  showScreen('main');
  render();
});

// ---------- List ----------

function render() {
  const list = $('list');
  list.innerHTML = '';
  $('empty').hidden = sightings.length > 0;
  for (const s of sightings) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${esc(s.species)}</strong> · ${s.date}</span>
      ${s.coords ? `<span class="coords">${esc(s.coords)}</span>` : ''}
      <span class="note">${esc(s.notes || '')}</span>
      <button class="remove" data-id="${s.id}" title="Remove observation">🗑</button>`;
    list.appendChild(li);
  }
}

$('open-form').addEventListener('click', () => showScreen('form-screen'));

$('list').addEventListener('click', (e) => {
  const btn = e.target.closest('.remove');
  if (!btn) return;
  pendingDeleteId = Number(btn.dataset.id);
  $('confirm').hidden = false;
});

$('confirm-yes').addEventListener('click', () => {
  sightings = sightings.filter((s) => s.id !== pendingDeleteId);
  persist();
  render();
  $('confirm').hidden = true;
  toast("Entry deleted. Whoops, it's gone forever! 👋");
});

$('confirm-no').addEventListener('click', () => {
  $('confirm').hidden = true;
});

// ---------- Export ----------

$('export').addEventListener('click', () => {
  if (sightings.length === 0) {
    alert('Nothing to export.');
    return;
  }
  const rows = [['species', 'date', 'location', 'notes']].concat(
    sightings.map((s) => [s.species, s.date, s.coords || '', s.notes || ''])
  );
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = 'sightings.csv';
  link.click();
});

// ---------- Add form ----------

function validate(entry) {
  if (!entry.species) return 'You forgot to enter a species.';
  if (!DATE_PATTERN.test(entry.date)) return 'ERROR: You entered an invalid date!!';
  if (entry.coords && !COORDS_PATTERN.test(entry.coords)) return 'Invalid input.';
  return null;
}

function showFormError(message) {
  $('form-error').textContent = message;
}

$('entry-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const entry = {
    id: Date.now(),
    species: $('species').value.trim(),
    date: $('date').value.trim(),
    coords: $('coords').value.trim(), // optional
    notes: $('notes').value.trim(),   // optional
  };

  const problem = validate(entry);
  if (problem) {
    showFormError(problem);
    return;
  }

  sightings.unshift(entry);
  try {
    persist();
  } catch (err) {
    sightings.shift();
    showFormError('Error: QuotaExceededError. Operation failed.');
    return;
  }

  $('entry-form').reset();
  showFormError('');
  showScreen('main');
  render();
  toast('Success!');
});

$('cancel-form').addEventListener('click', () => {
  $('entry-form').reset();
  showFormError('');
  showScreen('main');
});

// ---------- Start ----------

if (localStorage.getItem(ONBOARDED_KEY)) {
  showScreen('main');
  render();
} else {
  showScreen('onboarding');
}
