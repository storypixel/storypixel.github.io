import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  catmullRomToBezier,
  definitions,
  measureTangentContinuity,
  pointsToShape,
} from '../src/index.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
const version = packageJson.version;
const checkOnly = process.argv.includes('--check');
const changedFiles = [];

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, stableValue(value[key])]),
    );
  }
  return value;
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value));
}

function digestDefinition(definition) {
  return `sha256-${createHash('sha256').update(stableStringify(definition)).digest('hex')}`;
}

function normalizeTags(definition) {
  return [...new Set([
    ...definition.tags,
    `family:${definition.family}`,
    `capacity:${definition.selection.contentCapacity}`,
    ...definition.selection.uses.map((use) => `use:${use}`),
  ])].sort();
}

function indentShape(shape, indent = '    ') {
  return shape.replaceAll(', curve', `,\n${indent}curve`).replace(', close)', `,\n${indent}close\n  )`);
}

function shapeRule(entry) {
  return `.svhape--${entry.id} {\n  --svhape-fallback-radius: ${entry.fallbackRadius};\n  --svhape-safe-inset: ${entry.safeInset}%;\n  --svhape-shape: ${indentShape(entry.cssShape)};\n}`;
}

function standaloneCss(definition, shape) {
  const selector = `.svhape--${definition.id}`;
  const safeInset = Math.max(...Object.values(definition.selection.safeInset));
  return `${selector} {\n  border-radius: ${definition.fallbackRadius};\n  overflow: hidden;\n}\n\n${selector}.svhape--padded {\n  padding: ${safeInset}%;\n}\n\n@supports (clip-path: shape(from 0 0, line to 100% 0, line to 100% 100%, close)) {\n  ${selector} {\n    border-radius: 0;\n    clip-path: ${shape};\n  }\n}`;
}

function htmlSnippet(id) {
  return `<div class="svhape-shadow">\n  <div class="svhape svhape--${id} svhape--padded">\n    Your content\n  </div>\n</div>`;
}

function agentPrompt(entry) {
  return [
    `Use Svhapes v${version} shape "${entry.name}" (ID: ${entry.id}).`,
    `Include https://cdn.jsdelivr.net/gh/storypixel/svhapes@v${version}/dist/svhapes.css`,
    `Apply classes "svhape svhape--${entry.id}"; add "svhape--padded" when the library should supply padding.`,
    'Use a parent with class "svhape-shadow" when the clipped container needs a shadow.',
    `Use it only between aspect ratios ${entry.selection.aspect.min} and ${entry.selection.aspect.max}; ${entry.selection.aspect.preferred} is preferred.`,
    `Keep meaningful content inside the published ${entry.safeInset}% safe inset.`,
    'Retain the rounded fallback. Do not invent or hand-edit the generated shape path.',
    'Do not encode essential meaning in the silhouette.',
  ].join(' ');
}

function validateDefinitions() {
  if (definitions.length < 18) {
    throw new Error(`Expected at least 18 shapes, received ${definitions.length}`);
  }

  const ids = new Set();
  const pointDigests = new Set();

  for (const definition of definitions) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(definition.id)) {
      throw new Error(`Invalid shape ID: ${definition.id}`);
    }
    if (ids.has(definition.id)) throw new Error(`Duplicate shape ID: ${definition.id}`);
    ids.add(definition.id);

    const pointDigest = stableStringify(definition.points);
    if (pointDigests.has(pointDigest)) throw new Error(`Duplicate geometry: ${definition.id}`);
    pointDigests.add(pointDigest);

    const segments = catmullRomToBezier(definition.points, definition);
    const mismatch = measureTangentContinuity(segments);
    const tolerance = 1.1 * 10 ** -definition.precision;
    if (mismatch > tolerance) {
      throw new Error(`${definition.id} tangent mismatch ${mismatch} exceeds ${tolerance}`);
    }
  }
}

validateDefinitions();

const shapes = definitions
  .map((definition) => {
    const cssShape = pointsToShape(definition.points, definition);
    const safeInset = Math.max(...Object.values(definition.selection.safeInset));
    const entry = {
      id: definition.id,
      name: definition.name,
      family: definition.family,
      description: definition.description,
      className: `svhape--${definition.id}`,
      tags: normalizeTags(definition),
      recommendedFor: [...definition.recommendedFor].sort(),
      selection: {
        ...definition.selection,
        uses: [...definition.selection.uses].sort(),
      },
      geometry: {
        kind: 'closed-catmull-rom',
        anchorCount: definition.points.length,
        anchors: definition.points,
        closed: true,
        continuity: 'c1',
        tension: definition.tension,
        precision: definition.precision,
        cssShape,
        sourceDigest: digestDefinition(definition),
      },
      fallback: {
        borderRadius: definition.fallbackRadius,
      },
      snippets: {
        html: htmlSnippet(definition.id),
        selector: `.svhape.svhape--${definition.id}`,
        standaloneCss: standaloneCss(definition, cssShape),
      },
      agent: {
        shapeId: definition.id,
        stylesheet: `https://cdn.jsdelivr.net/gh/storypixel/svhapes@v${version}/dist/svhapes.css`,
        classes: ['svhape', `svhape--${definition.id}`],
        optionalClasses: ['svhape--padded', 'svhape--desktop-only'],
        optionalWrapperClass: 'svhape-shadow',
        html: htmlSnippet(definition.id),
        selection: definition.selection,
        safeInset: definition.selection.safeInset,
        constraints: [
          'Keep meaningful content inside the published safe inset.',
          'Do not encode essential information in the silhouette.',
          'Do not invent or edit the generated shape path.',
          'Retain the rounded fallback.',
        ],
        prompt: '',
      },
      safeInset,
      fallbackRadius: definition.fallbackRadius,
      cssShape,
    };

    entry.agent.prompt = agentPrompt(entry);
    return entry;
  })
  .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

const baseCss = `@layer svhapes {
  .svhape {
    border-radius: var(--svhape-fallback-radius, 24px);
    overflow: hidden;
  }

  .svhape--padded {
    padding: var(--svhape-padding, var(--svhape-safe-inset, 8%));
  }

  .svhape-shadow {
    --svhape-shadow:
      drop-shadow(0 3px 3px rgb(15 18 15 / 0.12))
      drop-shadow(0 16px 24px rgb(15 18 15 / 0.14));
    filter: var(--svhape-shadow);
  }

  @supports (clip-path: shape(from 0 0, line to 100% 0, line to 100% 100%, close)) {
    .svhape {
      border-radius: 0;
      clip-path: var(--svhape-shape);
    }

    @media (max-width: 640px) {
      .svhape--desktop-only {
        border-radius: var(--svhape-fallback-radius, 24px);
        clip-path: none;
      }
    }
  }
}
`;

const css = `/* Svhapes v${version} | MIT | https://github.com/storypixel/svhapes */\n${baseCss}\n${shapes.map(shapeRule).join('\n\n')}\n`;
const minifiedCss = css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .trim();

const catalog = {
  $schema: '../schema/svhape.schema.json',
  schemaVersion: '0.1.0',
  packageVersion: version,
  generatorVersion: version,
  shapeCount: shapes.length,
  shapes: shapes.map(({ safeInset: _safeInset, fallbackRadius: _fallbackRadius, cssShape: _cssShape, ...shape }) => shape),
};

const outputs = new Map([
  ['dist/svhapes.css', css],
  ['dist/svhapes.min.css', `${minifiedCss}\n`],
  ['dist/catalog.json', `${JSON.stringify(catalog, null, 2)}\n`],
  ['dist/svhapes.js', `export * from '../src/index.js';\n`],
]);

for (const [relativePath, content] of outputs) {
  const path = resolve(root, relativePath);
  if (checkOnly) {
    let existing = null;
    try {
      existing = await readFile(path, 'utf8');
    } catch {
      // A missing generated file is reported as drift below.
    }
    if (existing !== content) changedFiles.push(relativePath);
  } else {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}

if (checkOnly && changedFiles.length > 0) {
  console.error(`Generated files are stale: ${changedFiles.join(', ')}`);
  process.exitCode = 1;
} else if (checkOnly) {
  console.log(`Generated files are current (${shapes.length} shapes).`);
} else {
  console.log(`Generated ${shapes.length} shapes into dist/.`);
}
