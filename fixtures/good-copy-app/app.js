// Sprig: a tiny houseplant watering log.
// Plants are saved in this browser's localStorage. There is no server and no
// account, and nothing is uploaded.

const STORAGE_KEY = 'sprig.plants';
const WELCOMED_KEY = 'sprig.welcomed';
const MIN_DAYS = 1;
const MAX_DAYS = 60;
const DAY_MS = 24 * 60 * 60 * 1000;

const $ = (id) => document.getElementById(id);
const screens = ['welcome', 'main', 'form-screen'];

let plants = [];
let loadFailed = false;
let pendingDeleteId = null;
let toastTimer = null;

// ---------- Storage ----------

function load() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    plants = saved ? JSON.parse(saved) : [];
  } catch {
    plants = [];
    loadFailed = true;
  }
}

// Returns false when the browser refuses to save (storage full or blocked).
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
    return true;
  } catch {
    return false;
  }
}

function hasSeenWelcome() {
  try {
    return localStorage.getItem(WELCOMED_KEY) === 'yes';
  } catch {
    return false;
  }
}

function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOMED_KEY, 'yes');
  } catch {
    // The welcome screen shows again next time. Nothing else is affected.
  }
}

// ---------- Helpers ----------

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
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.textContent = ''; }, 4000);
}

function showListError(message) {
  $('list-error').textContent = message;
}

function startOfDay(time) {
  const d = new Date(time);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// The local date as YYYY-MM-DD, matching how the list counts days.
function localDate(time) {
  const d = new Date(time);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function scheduleText(days) {
  return days === 1 ? 'Water every day' : `Water every ${days} days`;
}

function lastWateredText(time) {
  if (!time) return 'Not watered yet';
  const days = Math.round((startOfDay(Date.now()) - startOfDay(time)) / DAY_MS);
  if (days <= 0) return 'Last watered today';
  if (days === 1) return 'Last watered yesterday';
  return `Last watered ${days} days ago`;
}

// ---------- Welcome ----------

$('welcome-add').addEventListener('click', () => {
  markWelcomeSeen();
  openForm();
});

$('welcome-skip').addEventListener('click', () => {
  markWelcomeSeen();
  showMain();
});

// ---------- List ----------

function showMain() {
  showScreen('main');
  render();
}

function render() {
  const hasPlants = plants.length > 0;
  $('load-error').hidden = !loadFailed;
  $('empty').hidden = loadFailed || hasPlants;
  $('open-form').hidden = loadFailed;
  $('download').hidden = loadFailed || !hasPlants;

  const list = $('list');
  list.innerHTML = '';
  for (const plant of plants) {
    const name = esc(plant.name);
    const li = document.createElement('li');
    li.innerHTML = `
      <h3>${name}</h3>
      <p class="meta">${scheduleText(plant.interval)}</p>
      <p class="meta">${lastWateredText(plant.lastWatered)}</p>
      ${plant.notes ? `<p class="note">${esc(plant.notes)}</p>` : ''}
      <div class="actions">
        <button class="water" data-id="${plant.id}">Mark as watered<span class="visually-hidden">: ${name}</span></button>
        <button class="delete secondary" data-id="${plant.id}">Delete<span class="visually-hidden"> ${name}</span></button>
      </div>`;
    list.appendChild(li);
  }
}

$('reload').addEventListener('click', () => location.reload());

$('list').addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const plant = plants.find((p) => p.id === Number(btn.dataset.id));
  if (!plant) return;
  if (btn.classList.contains('water')) markWatered(plant);
  if (btn.classList.contains('delete')) askToDelete(plant);
});

function markWatered(plant) {
  const previous = plant.lastWatered;
  plant.lastWatered = Date.now();
  if (!persist()) {
    plant.lastWatered = previous;
    showListError(`Couldn't mark ${plant.name} as watered. Try again, or check that your browser lets this site store data.`);
    return;
  }
  showListError('');
  render();
  document.querySelector(`.water[data-id="${plant.id}"]`).focus();
  toast(`${plant.name} marked as watered today.`);
}

// ---------- Delete ----------

function askToDelete(plant) {
  pendingDeleteId = plant.id;
  $('confirm-title').textContent = `Delete ${plant.name}?`;
  $('confirm').hidden = false;
  $('confirm-keep').focus();
}

function closeConfirm() {
  $('confirm').hidden = true;
  pendingDeleteId = null;
}

$('confirm-delete').addEventListener('click', () => {
  const plant = plants.find((p) => p.id === pendingDeleteId);
  closeConfirm();
  if (!plant) return;

  const before = plants;
  plants = plants.filter((p) => p.id !== plant.id);
  if (!persist()) {
    plants = before;
    showListError(`Couldn't delete ${plant.name}. Try again, or check that your browser lets this site store data.`);
    return;
  }
  showListError('');
  render();
  toast(`${plant.name} deleted.`);
});

$('confirm-keep').addEventListener('click', closeConfirm);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('confirm').hidden) closeConfirm();
});

// ---------- Download ----------

$('download').addEventListener('click', () => {
  const rows = [['Name', 'Days between waterings', 'Last watered', 'Notes']].concat(
    plants.map((p) => [
      p.name,
      p.interval,
      p.lastWatered ? localDate(p.lastWatered) : '',
      p.notes || '',
    ])
  );
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = 'plants.csv';
  link.click();
});

// ---------- Add form ----------

function setFieldError(field, message) {
  $(`${field}-error`).textContent = message;
  $(field).setAttribute('aria-invalid', message ? 'true' : 'false');
}

function openForm() {
  $('plant-form').reset();
  setFieldError('name', '');
  setFieldError('interval', '');
  $('save-error').textContent = '';
  showScreen('form-screen');
  $('name').focus();
}

$('open-form').addEventListener('click', openForm);
$('empty-add').addEventListener('click', openForm);

function validate(values) {
  const errors = {};
  if (!values.name) errors.name = 'Enter a plant name.';
  const days = Number(values.interval);
  if (!values.interval || !Number.isInteger(days) || days < MIN_DAYS || days > MAX_DAYS) {
    errors.interval = `Enter a whole number from ${MIN_DAYS} to ${MAX_DAYS}.`;
  }
  return errors;
}

$('plant-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const values = {
    name: $('name').value.trim(),
    interval: $('interval').value.trim(),
    notes: $('notes').value.trim(),
  };

  const errors = validate(values);
  setFieldError('name', errors.name || '');
  setFieldError('interval', errors.interval || '');
  $('save-error').textContent = '';

  // Move focus to the first field with an error.
  const firstInvalid = ['name', 'interval'].find((field) => errors[field]);
  if (firstInvalid) {
    $(firstInvalid).focus();
    return;
  }

  const plant = {
    id: Date.now(),
    name: values.name,
    interval: Number(values.interval),
    notes: values.notes,
    lastWatered: null,
  };
  plants.unshift(plant);
  if (!persist()) {
    plants.shift();
    $('save-error').textContent =
      "Couldn't save this plant. What you entered is still here. Try again, or check that your browser lets this site store data.";
    return;
  }

  showMain();
  toast(`${plant.name} saved.`);
});

$('cancel').addEventListener('click', showMain);

// ---------- Start ----------

// If saved plants can't be read, skip the welcome and show the load error.
load();
if (loadFailed || hasSeenWelcome()) showMain();
else showScreen('welcome');
