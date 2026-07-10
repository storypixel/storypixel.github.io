export const PHI = (1 + Math.sqrt(5)) / 2;

const DEFAULT_PRECISION = 3;
const DEFAULT_TENSION = 0;
const SAFE_CLASS_SELECTOR = /^\.[a-z_][a-z0-9_-]*(?:\.[a-z_][a-z0-9_-]*)*$/i;
const SAFE_SHAPE_VALUE = /^shape\([a-z0-9.%(),+\-/\s]+\)$/i;
const RADIUS_TOKEN = '(?:0|(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:px|rem|em|%|vw|vh|vmin|vmax|ch|ex))';
const SAFE_RADIUS_VALUE = new RegExp(
  `^${RADIUS_TOKEN}(?:\\s+${RADIUS_TOKEN}){0,3}(?:\\s*\\/\\s*${RADIUS_TOKEN}(?:\\s+${RADIUS_TOKEN}){0,3})?$`,
  'i',
);

function assertFiniteNumber(value, label) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number`);
  }
}

export function validatePoints(points, { minPoints = 4 } = {}) {
  if (!Array.isArray(points) || points.length < minPoints) {
    throw new TypeError(`points must contain at least ${minPoints} coordinate pairs`);
  }

  return points.map((point, index) => {
    if (!Array.isArray(point) || point.length !== 2) {
      throw new TypeError(`points[${index}] must be an [x, y] pair`);
    }

    const [x, y] = point;
    assertFiniteNumber(x, `points[${index}][0]`);
    assertFiniteNumber(y, `points[${index}][1]`);

    if (x < 0 || x > 100 || y < 0 || y > 100) {
      throw new RangeError(`points[${index}] must stay within the 0..100 reference box`);
    }

    return [x, y];
  });
}

export function roundCoordinate(value, precision = DEFAULT_PRECISION) {
  if (!Number.isInteger(precision) || precision < 0 || precision > 6) {
    throw new RangeError('precision must be an integer from 0 through 6');
  }

  const scale = 10 ** precision;
  const rounded = Math.round((value + Number.EPSILON) * scale) / scale;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function formatCoordinate(value, precision = DEFAULT_PRECISION) {
  return String(roundCoordinate(value, precision));
}

export function catmullRomToBezier(
  points,
  { tension = DEFAULT_TENSION, precision = DEFAULT_PRECISION } = {},
) {
  const anchors = validatePoints(points);
  assertFiniteNumber(tension, 'tension');

  if (tension < 0 || tension > 1) {
    throw new RangeError('tension must be between 0 and 1');
  }

  const scale = (1 - tension) / 6;

  return anchors.map((from, index) => {
    const previous = anchors[(index - 1 + anchors.length) % anchors.length];
    const to = anchors[(index + 1) % anchors.length];
    const after = anchors[(index + 2) % anchors.length];

    return {
      from: from.map((value) => roundCoordinate(value, precision)),
      to: to.map((value) => roundCoordinate(value, precision)),
      control1: [
        roundCoordinate(from[0] + (to[0] - previous[0]) * scale, precision),
        roundCoordinate(from[1] + (to[1] - previous[1]) * scale, precision),
      ],
      control2: [
        roundCoordinate(to[0] - (after[0] - from[0]) * scale, precision),
        roundCoordinate(to[1] - (after[1] - from[1]) * scale, precision),
      ],
    };
  });
}

export function measureTangentContinuity(segments) {
  if (!Array.isArray(segments) || segments.length === 0) {
    throw new TypeError('segments must be a non-empty array');
  }

  let maxComponentMismatch = 0;

  for (let index = 0; index < segments.length; index += 1) {
    const incoming = segments[index];
    const outgoing = segments[(index + 1) % segments.length];
    const anchor = incoming.to;
    const incomingTangent = [
      anchor[0] - incoming.control2[0],
      anchor[1] - incoming.control2[1],
    ];
    const outgoingTangent = [
      outgoing.control1[0] - anchor[0],
      outgoing.control1[1] - anchor[1],
    ];

    maxComponentMismatch = Math.max(
      maxComponentMismatch,
      Math.abs(incomingTangent[0] - outgoingTangent[0]),
      Math.abs(incomingTangent[1] - outgoingTangent[1]),
    );
  }

  return maxComponentMismatch;
}

export function pointsToShape(points, options = {}) {
  const precision = options.precision ?? DEFAULT_PRECISION;
  const segments = catmullRomToBezier(points, options);
  const [startX, startY] = segments[0].from;
  const commands = segments.map(({ to, control1, control2 }) => (
    `curve to ${formatCoordinate(to[0], precision)}% ${formatCoordinate(to[1], precision)}% `
      + `with ${formatCoordinate(control1[0], precision)}% ${formatCoordinate(control1[1], precision)}% / `
      + `${formatCoordinate(control2[0], precision)}% ${formatCoordinate(control2[1], precision)}%`
  ));

  return `shape(from ${formatCoordinate(startX, precision)}% ${formatCoordinate(startY, precision)}%, ${commands.join(', ')}, close)`;
}

export function shapeToCss(shape, {
  className = '.my-svhape',
  fallbackRadius = '24px',
  includeBase = true,
} = {}) {
  if (typeof shape !== 'string' || !SAFE_SHAPE_VALUE.test(shape)) {
    throw new TypeError('shape must be a safe CSS shape() value without declaration delimiters');
  }
  if (typeof className !== 'string' || !SAFE_CLASS_SELECTOR.test(className)) {
    throw new TypeError('className must be one or more simple class selectors');
  }
  if (typeof fallbackRadius !== 'string' || !SAFE_RADIUS_VALUE.test(fallbackRadius)) {
    throw new TypeError('fallbackRadius must contain one to eight numeric CSS radius values');
  }

  const base = includeBase
    ? `${className} {\n  border-radius: ${fallbackRadius};\n  overflow: hidden;\n}\n\n`
    : '';

  return `${base}@supports (clip-path: shape(from 0 0, line to 100% 0, line to 100% 100%, close)) {\n  ${className} {\n    border-radius: 0;\n    clip-path: ${shape};\n  }\n}`;
}
