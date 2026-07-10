const INSTALL_SNIPPET = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/svhapes@0.1.0/dist/svhapes.min.css">';
const MARKUP_SNIPPET = `<div class="svhape-shadow">
  <div class="svhape svhape--golden-tide svhape--padded">
    Your content
  </div>
</div>`;
const AGENT_COMMAND = 'svhapes prompt golden-tide --format json';
// Mono + dither tone cycle; golden-tide is the single accent in the catalog view.
const TONES = ['fill-gray', 'fill-dither-light', 'fill-ink', 'fill-dither-dark'];
const ACCENT_SHAPE_ID = 'golden-tide';

const grid = document.querySelector('[data-shape-grid]');
const filters = document.querySelector('[data-filters]');
const search = document.querySelector('[data-search]');
const count = document.querySelector('[data-results-count]');
const empty = document.querySelector('[data-empty]');
const toast = document.querySelector('[data-toast]');
const supportNote = document.querySelector('[data-support-note]');

let catalog = [];
let activeFamily = 'all';
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.dataset.visible = 'true';
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.dataset.visible = 'false';
  }, 1800);
}

async function copyText(text, label) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    showToast(`${label} copied`);
  } catch {
    showToast('Copy failed—select the visible code instead');
  }
}

function makeButton(label, copyType, shapeId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.dataset.copy = copyType;
  button.dataset.shape = shapeId;
  button.setAttribute('aria-label', `Copy ${label.toLowerCase()} for ${shapeId}`);
  return button;
}

function renderCard(shape, index) {
  const card = document.createElement('article');
  card.className = 'shape-card';
  card.dataset.family = shape.family;
  card.id = `shape-${shape.id}`;

  const previewWrap = document.createElement('div');
  previewWrap.className = 'shape-preview-wrap';
  const shadow = document.createElement('div');
  shadow.className = 'shape-preview-shadow svhape-shadow';
  const preview = document.createElement('div');
  const tone = shape.id === ACCENT_SHAPE_ID ? 'fill-accent' : TONES[index % TONES.length];
  preview.className = `shape-preview svhape ${shape.className} ${tone}`;
  preview.style.setProperty('--preview-padding', `${Math.max(18, shape.selection.safeInset.top + 10)}px`);

  const family = document.createElement('span');
  family.textContent = shape.family;
  const sample = document.createElement('strong');
  sample.textContent = shape.family === 'emblem' || shape.family === 'blob'
    ? shape.name.split(' ')[0]
    : 'Useful content still fits.';
  preview.append(family, sample);
  shadow.append(preview);
  previewWrap.append(shadow);

  const body = document.createElement('div');
  body.className = 'shape-card-body';
  const titleRow = document.createElement('div');
  titleRow.className = 'shape-card-title';
  const title = document.createElement('h3');
  title.textContent = shape.name;
  const id = document.createElement('span');
  id.className = 'shape-id';
  id.textContent = shape.id;
  titleRow.append(title, id);

  const description = document.createElement('p');
  description.className = 'shape-description';
  description.textContent = shape.description;

  const meta = document.createElement('div');
  meta.className = 'shape-meta';
  [shape.family, shape.selection.contentCapacity, `${shape.geometry.anchorCount} anchors`].forEach((value) => {
    const chip = document.createElement('span');
    chip.textContent = value;
    meta.append(chip);
  });

  const actions = document.createElement('div');
  actions.className = 'shape-actions';
  actions.append(
    makeButton('HTML', 'html', shape.id),
    makeButton('CSS', 'css', shape.id),
    makeButton('Agent', 'agent', shape.id),
  );

  body.append(titleRow, description, meta, actions);
  card.append(previewWrap, body);
  return card;
}

function render() {
  const query = search.value.trim().toLowerCase();
  const visible = catalog.filter((shape) => {
    const matchesFamily = activeFamily === 'all' || shape.family === activeFamily;
    const searchable = [
      shape.id,
      shape.name,
      shape.family,
      shape.description,
      ...shape.tags,
      ...shape.recommendedFor,
      ...shape.selection.uses,
    ].join(' ').toLowerCase();
    return matchesFamily && searchable.includes(query);
  });

  grid.replaceChildren(...visible.map((shape) => renderCard(shape, catalog.indexOf(shape))));
  count.textContent = `${visible.length} of ${catalog.length} shapes`;
  empty.hidden = visible.length !== 0;
}

function renderFilters() {
  const families = ['all', ...new Set(catalog.map(({ family }) => family))];
  filters.replaceChildren(...families.map((family) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.textContent = family;
    button.dataset.family = family;
    button.setAttribute('aria-pressed', String(family === activeFamily));
    return button;
  }));
}

filters.addEventListener('click', (event) => {
  const button = event.target.closest('[data-family]');
  if (!button) return;
  activeFamily = button.dataset.family;
  for (const candidate of filters.querySelectorAll('[data-family]')) {
    candidate.setAttribute('aria-pressed', String(candidate === button));
  }
  render();
});

search.addEventListener('input', render);

grid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-copy]');
  if (!button) return;
  const shape = catalog.find(({ id }) => id === button.dataset.shape);
  if (!shape) return;

  const values = {
    html: shape.snippets.html,
    css: shape.snippets.standaloneCss,
    agent: shape.agent.prompt,
  };
  copyText(values[button.dataset.copy], `${shape.name} ${button.dataset.copy.toUpperCase()}`);
});

for (const button of document.querySelectorAll('[data-copy-install]')) {
  button.addEventListener('click', () => copyText(INSTALL_SNIPPET, 'Stylesheet link'));
}

document.querySelector('[data-copy-markup]').addEventListener('click', () => copyText(MARKUP_SNIPPET, 'Markup'));
document.querySelector('[data-copy-agent-command]').addEventListener('click', () => copyText(AGENT_COMMAND, 'Agent command'));

const supportsShape = CSS.supports(
  'clip-path',
  'shape(from 0 0, line to 100% 0, line to 100% 100%, close)',
);
supportNote.dataset.supported = String(supportsShape);
supportNote.textContent = supportsShape
  ? 'This browser supports CSS shape(). You are seeing the full generated contours.'
  : 'This browser does not support CSS shape() yet. Svhapes is preserving the rounded fallbacks.';

try {
  const response = await fetch(new URL('../dist/catalog.json', import.meta.url));
  if (!response.ok) throw new Error(`Catalog request failed: ${response.status}`);
  const data = await response.json();
  catalog = data.shapes;
  renderFilters();
  render();
} catch (error) {
  const message = document.createElement('p');
  message.className = 'catalog-error';
  message.textContent = `The shape catalog could not load. ${error.message}`;
  grid.replaceChildren(message);
  count.textContent = 'Catalog unavailable';
}
