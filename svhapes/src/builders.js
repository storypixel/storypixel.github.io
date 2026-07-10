import { PHI, roundCoordinate, validatePoints } from './core.js';

function assertFinite(value, label) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }
}

function assertPair(value, label, { positive = false } = {}) {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new TypeError(`${label} must be an [x, y] pair`);
  }

  value.forEach((coordinate, index) => {
    assertFinite(coordinate, `${label}[${index}]`);
    if (positive && coordinate <= 0) {
      throw new RangeError(`${label}[${index}] must be greater than 0`);
    }
  });
}

function sideValue(value, side, fallback) {
  if (typeof value === 'number') return value;
  return value?.[side] ?? fallback;
}

function normalizedPositions(count, ratio, phase = 0) {
  const interiorCount = count * 2 + 1;
  const intervalCount = interiorCount + 1;
  const safeRatio = Number.isFinite(ratio) && ratio >= 1 ? ratio : 1;
  const weights = Array.from({ length: intervalCount }, (_, index) => (
    (index + phase) % 2 === 0 ? 1 : safeRatio
  ));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let consumed = 0;

  return weights.slice(0, -1).map((weight) => {
    consumed += weight;
    return consumed / total;
  });
}

function edgeLevels(count, secondaryRatio, phase = 0) {
  return Array.from({ length: count * 2 + 1 }, (_, index) => (
    (index + phase) % 4 < 2 ? 1 : secondaryRatio
  ));
}

export function makeEdgeShape({
  counts,
  inset = 5,
  amplitude = 1.5,
  spacingRatio = PHI,
  secondaryRatio = 1 / PHI,
  spacingPhase = {},
  levelPhase = {},
  precision = 3,
}) {
  const sides = ['top', 'right', 'bottom', 'left'];
  const resolvedCounts = Object.fromEntries(sides.map((side) => [side, sideValue(counts, side, 2)]));
  const resolvedInset = Object.fromEntries(sides.map((side) => [side, sideValue(inset, side, 5)]));
  const resolvedAmplitude = Object.fromEntries(sides.map((side) => [side, sideValue(amplitude, side, 1.5)]));

  const leftX = resolvedInset.left;
  const rightX = 100 - resolvedInset.right;
  const topY = resolvedInset.top;
  const bottomY = 100 - resolvedInset.bottom;
  const points = [[leftX, topY]];

  const appendSide = (side, start, end, baseline, outwardSign) => {
    const count = resolvedCounts[side];
    const positions = normalizedPositions(count, spacingRatio, spacingPhase[side] ?? 0);
    const levels = edgeLevels(count, secondaryRatio, levelPhase[side] ?? 0);

    positions.forEach((position, index) => {
      const along = start + (end - start) * position;
      const isOutward = index % 2 === 0;
      const offset = resolvedAmplitude[side] * levels[index] * (isOutward ? outwardSign : -outwardSign);

      if (side === 'top' || side === 'bottom') {
        points.push([along, baseline + offset]);
      } else {
        points.push([baseline + offset, along]);
      }
    });
  };

  appendSide('top', leftX, rightX, topY, -1);
  points.push([rightX, topY]);
  appendSide('right', topY, bottomY, rightX, 1);
  points.push([rightX, bottomY]);
  appendSide('bottom', rightX, leftX, bottomY, 1);
  points.push([leftX, bottomY]);
  appendSide('left', bottomY, topY, leftX, -1);

  return points.map(([x, y]) => [
    roundCoordinate(x, precision),
    roundCoordinate(y, precision),
  ]);
}

export function makeRadialShape({
  lobes = 8,
  center = [50, 50],
  radius = [42, 42],
  amplitude = 0.08,
  secondaryRatio = 1 / PHI,
  phase = -Math.PI / 2,
  precision = 3,
}) {
  if (!Number.isInteger(lobes) || lobes < 3) {
    throw new RangeError('lobes must be an integer of at least 3');
  }

  const count = lobes * 2;
  return Array.from({ length: count }, (_, index) => {
    const angle = phase + (Math.PI * 2 * index) / count;
    const isOuter = index % 2 === 0;
    const level = index % 4 < 2 ? 1 : secondaryRatio;
    const radiusScale = 1 + amplitude * level * (isOuter ? 1 : -1);
    return [
      roundCoordinate(center[0] + Math.cos(angle) * radius[0] * radiusScale, precision),
      roundCoordinate(center[1] + Math.sin(angle) * radius[1] * radiusScale, precision),
    ];
  });
}

/**
 * Add an explicit two-point fillet around every corner of a closed polygon.
 * `radius` is a ratio of the shorter adjacent edge, so the result scales with
 * the normalized 0..100 reference box. A per-corner array is also accepted.
 */
export function filletPoints(points, { radius = 0.18, precision = 3 } = {}) {
  const anchors = validatePoints(points, { minPoints: 3 });
  const radii = Array.isArray(radius) ? radius : anchors.map(() => radius);

  if (radii.length !== anchors.length) {
    throw new TypeError('radius must be a number or one value per point');
  }
  radii.forEach((value, index) => {
    assertFinite(value, `radius[${index}]`);
    if (value < 0 || value > 0.5) {
      throw new RangeError('radius values must be between 0 and 0.5');
    }
  });

  if (radii.every((value) => value === 0)) {
    return anchors.map(([x, y]) => [roundCoordinate(x, precision), roundCoordinate(y, precision)]);
  }

  const filleted = [];
  anchors.forEach((point, index) => {
    const previous = anchors[(index - 1 + anchors.length) % anchors.length];
    const next = anchors[(index + 1) % anchors.length];
    const incoming = [point[0] - previous[0], point[1] - previous[1]];
    const outgoing = [next[0] - point[0], next[1] - point[1]];
    const incomingLength = Math.hypot(...incoming);
    const outgoingLength = Math.hypot(...outgoing);

    if (incomingLength === 0 || outgoingLength === 0) {
      throw new RangeError(`points[${index}] cannot have a zero-length adjacent edge`);
    }

    const distance = Math.min(incomingLength, outgoingLength) * radii[index];
    const beforeCorner = [
      point[0] - (incoming[0] / incomingLength) * distance,
      point[1] - (incoming[1] / incomingLength) * distance,
    ];
    const afterCorner = [
      point[0] + (outgoing[0] / outgoingLength) * distance,
      point[1] + (outgoing[1] / outgoingLength) * distance,
    ];

    if (distance === 0) {
      filleted.push(point);
    } else {
      filleted.push(beforeCorner, afterCorner);
    }
  });

  return validatePoints(filleted, { minPoints: 3 }).map(([x, y]) => [
    roundCoordinate(x, precision),
    roundCoordinate(y, precision),
  ]);
}

/**
 * Build a balanced perimeter with the same number of repeat beats on every
 * side. Use `makeEdgeShape` directly when each side needs a different count.
 */
export function makeRepeatingEdgeShape({ repeats = 4, ...options } = {}) {
  if (!Number.isInteger(repeats) || repeats < 1) {
    throw new RangeError('repeats must be an integer of at least 1');
  }

  return validatePoints(makeEdgeShape({ ...options, counts: repeats }));
}

/** Build a radial shape with a repeat count expressed as lobe count. */
export function makeRepeatingRadialShape({ repeats = 6, ...options } = {}) {
  if (!Number.isInteger(repeats) || repeats < 3) {
    throw new RangeError('repeats must be an integer of at least 3');
  }

  return validatePoints(makeRadialShape({ ...options, lobes: repeats }));
}

/**
 * Generate a responsive superellipse. `exponent: 2` is an ellipse and
 * `exponent: 4` is a squircle-like contour; higher values become squarer.
 */
export function makeSuperellipseShape({
  exponent = 4,
  center = [50, 50],
  radius = [43, 43],
  points = 24,
  phase = -Math.PI / 2,
  precision = 3,
} = {}) {
  assertFinite(exponent, 'exponent');
  if (exponent <= 0) {
    throw new RangeError('exponent must be greater than 0');
  }
  if (!Number.isInteger(points) || points < 8) {
    throw new RangeError('points must be an integer of at least 8');
  }
  assertFinite(phase, 'phase');
  assertPair(center, 'center');
  assertPair(radius, 'radius', { positive: true });

  const power = 2 / exponent;
  const anchors = Array.from({ length: points }, (_, index) => {
    const angle = phase + (Math.PI * 2 * index) / points;
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    return [
      center[0] + Math.sign(cosine) * (Math.abs(cosine) ** power) * radius[0],
      center[1] + Math.sign(sine) * (Math.abs(sine) ** power) * radius[1],
    ];
  });

  return validatePoints(anchors).map(([x, y]) => [
    roundCoordinate(x, precision),
    roundCoordinate(y, precision),
  ]);
}
