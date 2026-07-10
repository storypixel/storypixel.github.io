import { PHI, roundCoordinate } from './core.js';

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
