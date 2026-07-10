import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import {
  catmullRomToBezier,
  definitions,
  measureTangentContinuity,
  pointsToShape,
  shapeToCss,
  validatePoints,
} from '../src/index.js';

test('pointsToShape emits a closed percentage-based CSS shape', () => {
  const shape = pointsToShape([[5, 5], [95, 5], [95, 95], [5, 95]]);
  assert.match(shape, /^shape\(from 5% 5%, curve to 95% 5%/);
  assert.match(shape, /, close\)$/);
});

test('closed conversion emits one segment per anchor', () => {
  const points = [[10, 10], [90, 10], [90, 90], [10, 90]];
  const segments = catmullRomToBezier(points);
  assert.equal(segments.length, points.length);
  assert.deepEqual(segments.at(-1).to, points[0]);
});

test('every catalog curve remains tangent-continuous after rounding', () => {
  for (const definition of definitions) {
    const segments = catmullRomToBezier(definition.points, definition);
    const mismatch = measureTangentContinuity(segments);
    assert.ok(mismatch <= 0.0011, `${definition.id}: ${mismatch}`);
  }
});

test('definitions are unique, bounded, and carry selection metadata', () => {
  assert.ok(definitions.length >= 18);
  assert.equal(new Set(definitions.map(({ id }) => id)).size, definitions.length);
  assert.equal(new Set(definitions.map(({ points }) => JSON.stringify(points))).size, definitions.length);

  for (const definition of definitions) {
    assert.doesNotThrow(() => validatePoints(definition.points));
    assert.match(definition.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(definition.selection.uses.length > 0);
    assert.ok(definition.selection.aspect.min <= definition.selection.aspect.preferred);
    assert.ok(definition.selection.aspect.preferred <= definition.selection.aspect.max);
    assert.deepEqual(Object.keys(definition.selection.safeInset).sort(), ['bottom', 'left', 'right', 'top']);
  }
});

test('invalid anchors fail before CSS generation', () => {
  assert.throws(() => validatePoints([[0, 0], [100, 0], [100, 100]]), /at least 4/);
  assert.throws(() => validatePoints([[0, 0], [101, 0], [100, 100], [0, 100]]), /0\.\.100/);
  assert.throws(() => validatePoints([[0, 0], [100, 0], [100, Number.NaN], [0, 100]]), /finite number/);
});

test('standalone CSS preserves fallback and progressive enhancement', () => {
  const shape = pointsToShape([[5, 5], [95, 5], [95, 95], [5, 95]]);
  const css = shapeToCss(shape, { className: '.example', fallbackRadius: '20px' });
  assert.match(css, /border-radius: 20px/);
  assert.match(css, /@supports \(clip-path: shape/);
  assert.match(css, /clip-path: shape\(/);
  assert.throws(
    () => shapeToCss(`${shape}; body { color: red; }`),
    /safe CSS shape/,
  );
  assert.throws(
    () => shapeToCss(shape, { className: '.example, body' }),
    /simple class selectors/,
  );
  assert.throws(
    () => shapeToCss(shape, { fallbackRadius: '20px; color: red' }),
    /numeric CSS radius/,
  );
});

test('published point schema requires exactly two coordinates', async () => {
  const schema = JSON.parse(await readFile(new URL('../schema/svhape.schema.json', import.meta.url), 'utf8'));
  assert.equal(schema.$defs.point.minItems, 2);
  assert.equal(schema.$defs.point.maxItems, 2);
  assert.equal(schema.$defs.point.prefixItems.length, 2);
  assert.equal(schema.$defs.point.items, false);
});

test('generated catalog and stylesheet contain every source definition', async () => {
  const catalog = JSON.parse(await readFile(new URL('../dist/catalog.json', import.meta.url), 'utf8'));
  const css = await readFile(new URL('../dist/svhapes.css', import.meta.url), 'utf8');
  assert.equal(catalog.shapeCount, definitions.length);
  assert.deepEqual(catalog.shapes.map(({ id }) => id), [...catalog.shapes.map(({ id }) => id)].sort());

  for (const definition of definitions) {
    const entry = catalog.shapes.find(({ id }) => id === definition.id);
    assert.ok(entry, definition.id);
    assert.match(entry.geometry.sourceDigest, /^sha256-[a-f0-9]{64}$/);
    assert.ok(entry.snippets.standaloneCss.includes(`.svhape--${definition.id} {`));
    assert.ok(entry.snippets.html.includes(`svhape--${definition.id}`));
    assert.ok(entry.agent.html.includes(`svhape--${definition.id}`));
    assert.ok(css.includes(`.svhape--${definition.id} {`));
  }
});

test('CLI returns stable JSON and useful errors', () => {
  const success = spawnSync(process.execPath, ['bin/svhapes.js', 'show', 'golden-tide', '--format', 'json'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });
  assert.equal(success.status, 0, success.stderr);
  const envelope = JSON.parse(success.stdout);
  assert.equal(envelope.ok, true);
  assert.equal(envelope.data.id, 'golden-tide');

  const failure = spawnSync(process.execPath, ['bin/svhapes.js', 'show', 'not-a-shape', '--format', 'json'], {
    cwd: new URL('..', import.meta.url),
    encoding: 'utf8',
  });
  assert.equal(failure.status, 3);
  const error = JSON.parse(failure.stderr);
  assert.equal(error.error.code, 'UNKNOWN_SHAPE');

  const invalidInvocations = [
    ['frobnicate', '--format', 'json'],
    ['show', 'golden-tide', 'extra', '--format', 'json'],
    ['show', 'golden-tide', '--family', 'blob', '--format', 'json'],
  ];
  for (const args of invalidInvocations) {
    const invalid = spawnSync(process.execPath, ['bin/svhapes.js', ...args], {
      cwd: new URL('..', import.meta.url),
      encoding: 'utf8',
    });
    assert.equal(invalid.status, 2, `${args.join(' ')}\n${invalid.stdout}\n${invalid.stderr}`);
    const invalidError = JSON.parse(invalid.stderr);
    assert.equal(invalidError.error.code, 'INVALID_ARGUMENTS');
  }
});
