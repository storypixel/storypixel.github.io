const INSTALL_SNIPPET = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/svhapes@0.2.2/dist/svhapes.min.css">';
const MARKUP_SNIPPET = `<div class="svhape-shadow">
  <div class="svhape svhape--golden-tide svhape--padded">
    Your content
  </div>
</div>`;
const AGENT_COMMAND = 'svhapes prompt golden-tide --format json';
const MOTION_SNIPPETS = Object.freeze({
  float: `@media (prefers-reduced-motion: no-preference) {
  .svhape-motion--float {
    animation: svhapes-float 5s ease-in-out infinite;
  }
}

@keyframes svhapes-float {
  50% { transform: translateY(-8px) rotate(1deg); }
}`,
  morph: `@supports (clip-path: shape(from 0 0, line to 100% 0, close)) {
  .svhape-motion--morph {
    animation: svhapes-morph 6s ease-in-out infinite alternate;
  }
}

@keyframes svhapes-morph {
  from {
    clip-path: shape(from 8% 12%, curve to 30% 5% with 11.5% 4.83% / 22.33% 5.5%, curve to 54% 9% with 37.67% 4.5% / 46% 9.17%, curve to 78% 4% with 62% 8.83% / 71.33% 3.33%, curve to 94% 13% with 84.67% 4.67% / 91.67% 5.33%, curve to 92% 50% with 96.33% 20.67% / 91.83% 37.5%, curve to 95% 88% with 92.17% 62.5% / 98.67% 80.67%, curve to 70% 94% with 91.33% 95.33% / 78% 93.67%, curve to 47% 90% with 62% 94.33% / 54.83% 89.67%, curve to 23% 96% with 39.17% 90.33% / 30% 97%, curve to 5% 84% with 16% 95% / 7.33% 92%, curve to 9% 48% with 2.67% 76% / 8.5% 60%, curve to 8% 12% with 9.5% 36% / 4.5% 19.17%, close);
  }
  to {
    clip-path: shape(from 5% 21%, curve to 24% 4% with 7% 13.17% / 16.5% 5.5%, curve to 50% 12% with 31.5% 2.5% / 41.33% 12.17%, curve to 76% 3% with 58.67% 11.83% / 68.5% 1.5%, curve to 95% 21% with 83.5% 4.5% / 93% 13.5%, curve to 88% 48% with 97% 28.5% / 87.83% 38.33%, curve to 96% 79% with 88.17% 57.67% / 99.17% 70.83%, curve to 69% 97% with 92.83% 87.17% / 76.67% 95.83%, curve to 50% 86% with 61.33% 98.17% / 56.83% 85.83%, curve to 28% 98% with 43.17% 86.17% / 35.83% 99.17%, curve to 3% 79% with 20.17% 96.83% / 5.67% 86.83%, curve to 12% 51% with 0.33% 71.17% / 11.67% 60.67%, curve to 5% 21% with 12.33% 41.33% / 3% 28.83%, close);
  }
}

@media (prefers-reduced-motion: reduce) {
  .svhape-motion--morph { animation: none; }
}`,
  hover: `.svhape-motion--hover {
  transition: transform 220ms ease, filter 220ms ease;
}

.svhape-motion--hover:hover,
.svhape-motion--hover:focus-visible {
  transform: translateY(-5px) rotate(-0.5deg);
}

@media (prefers-reduced-motion: reduce) {
  .svhape-motion--hover { transition: none; }
}`,
});
const BUILDER_SNIPPETS = Object.freeze({
  fillet: `import { filletPoints, pointsToShape } from 'svhapes';

const clipPath = pointsToShape(filletPoints([
  [5, 5], [95, 5], [95, 95], [5, 95],
], { radius: 0.2 }));`,
  repeat: `import { makeRepeatingEdgeShape, pointsToShape } from 'svhapes';

const clipPath = pointsToShape(makeRepeatingEdgeShape({
  repeats: 5,
  amplitude: 1.25,
}));`,
  squircle: `import { makeSuperellipseShape, pointsToShape } from 'svhapes';

const clipPath = pointsToShape(makeSuperellipseShape({
  exponent: 4,
  radius: [44, 42],
}));`,
});
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

for (const code of document.querySelectorAll('[data-motion-code]')) {
  code.textContent = MOTION_SNIPPETS[code.dataset.motionCode];
}

for (const button of document.querySelectorAll('[data-copy-motion]')) {
  button.addEventListener('click', () => {
    const type = button.dataset.copyMotion;
    copyText(MOTION_SNIPPETS[type], `${type} motion CSS`);
  });
}

for (const code of document.querySelectorAll('[data-builder-code]')) {
  code.textContent = BUILDER_SNIPPETS[code.dataset.builderCode];
}

for (const button of document.querySelectorAll('[data-copy-builder]')) {
  button.addEventListener('click', () => {
    const type = button.dataset.copyBuilder;
    copyText(BUILDER_SNIPPETS[type], `${type} builder JS`);
  });
}

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
