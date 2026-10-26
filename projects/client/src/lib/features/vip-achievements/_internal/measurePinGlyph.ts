import type { PinGlyph } from './PinGlyph.ts';
import type { PinShape } from './PinShape.ts';

type Point = readonly [number, number];

type PinBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const CURVE_STEPS = 24;
const TOKEN = /[MLHVQAZmlhvqaz]|-?\d*\.?\d+/g;

function sampleQuadratic(from: Point, control: Point, to: Point): Point[] {
  return Array.from({ length: CURVE_STEPS }, (_, index) => {
    const t = (index + 1) / CURVE_STEPS;
    const u = 1 - t;
    return [
      u * u * from[0] + 2 * u * t * control[0] + t * t * to[0],
      u * u * from[1] + 2 * u * t * control[1] + t * t * to[1],
    ];
  });
}

/** The arc's angle, wound the way its sweep flag asks. */
function toSweep(angle: number, isClockwise: boolean) {
  const turn = 2 * Math.PI;
  if (isClockwise && angle <= 0) return angle + turn;
  if (!isClockwise && angle >= 0) return angle - turn;
  return angle;
}

/** Endpoint-to-centre conversion from the SVG spec, for unrotated arcs. */
function sampleArc(
  from: Point,
  [rx, ry, isLarge, isSweep]: readonly [number, number, number, number],
  to: Point,
): Point[] {
  const dx = (from[0] - to[0]) / 2;
  const dy = (from[1] - to[1]) / 2;
  const fit = Math.max(
    1,
    Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)),
  );
  const radiusX = rx * fit;
  const radiusY = ry * fit;
  const numerator =
    radiusX * radiusX * radiusY * radiusY -
    radiusX * radiusX * dy * dy -
    radiusY * radiusY * dx * dx;
  const denominator = radiusX * radiusX * dy * dy + radiusY * radiusY * dx * dx;
  const sign = isLarge === isSweep ? -1 : 1;
  const factor = sign * Math.sqrt(Math.max(0, numerator) / (denominator || 1));
  const cx = factor * ((radiusX * dy) / radiusY) + (from[0] + to[0]) / 2;
  const cy = factor * (-(radiusY * dx) / radiusX) + (from[1] + to[1]) / 2;
  const start = Math.atan2((from[1] - cy) / radiusY, (from[0] - cx) / radiusX);
  const end = Math.atan2((to[1] - cy) / radiusY, (to[0] - cx) / radiusX);
  const sweep = toSweep(end - start, Boolean(isSweep));
  return Array.from({ length: CURVE_STEPS }, (_, index) => {
    const angle = start + (sweep * (index + 1)) / CURVE_STEPS;
    return [cx + radiusX * Math.cos(angle), cy + radiusY * Math.sin(angle)];
  });
}

/** Points along a path built from the commands the pin artwork uses. */
function samplePath(d: string): Point[] {
  const tokens = d.match(TOKEN) ?? [];
  const points: Point[] = [];
  let cursor: Point = [0, 0];
  let start: Point = [0, 0];
  let command = '';
  let index = 0;
  const read = () => Number(tokens[index++]);

  while (index < tokens.length) {
    const token = tokens[index] ?? '';
    if (/[A-Za-z]/.test(token)) {
      command = token;
      index++;
      if (command === 'Z' || command === 'z') {
        cursor = start;
        continue;
      }
    }
    const isRelative = command === command.toLowerCase();
    const offset = (point: Point): Point =>
      isRelative ? [cursor[0] + point[0], cursor[1] + point[1]] : point;

    switch (command.toUpperCase()) {
      case 'M':
      case 'L': {
        cursor = offset([read(), read()]);
        if (command.toUpperCase() === 'M') start = cursor;
        points.push(cursor);
        break;
      }
      case 'H': {
        const x = read();
        cursor = [isRelative ? cursor[0] + x : x, cursor[1]];
        points.push(cursor);
        break;
      }
      case 'V': {
        const y = read();
        cursor = [cursor[0], isRelative ? cursor[1] + y : y];
        points.push(cursor);
        break;
      }
      case 'Q': {
        const control = offset([read(), read()]);
        const to = offset([read(), read()]);
        points.push(...sampleQuadratic(cursor, control, to));
        cursor = to;
        break;
      }
      case 'A': {
        const arc = [read(), read(), read(), read(), read()] as const;
        const to = offset([read(), read()]);
        points.push(...sampleArc(cursor, [arc[0], arc[1], arc[3], arc[4]], to));
        cursor = to;
        break;
      }
      default:
        index++;
    }
  }
  return points;
}

function applyTransform(points: Point[], transform: string | undefined) {
  if (!transform) return points;
  const [name, ...args] = transform.split(/[\s(),]+/).filter(Boolean);
  const [a = 0, b = 0, c = 0] = args.map(Number);
  if (name === 'translate') {
    return points.map(([x, y]): Point => [x + a, y + b]);
  }
  if (name === 'rotate') {
    const angle = (a * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return points.map(
      ([x, y]): Point => [
        b + (x - b) * cos - (y - c) * sin,
        c + (x - b) * sin + (y - c) * cos,
      ],
    );
  }
  return points;
}

const padding = (shape: PinShape) =>
  shape.kind === 'stroke' ? shape.width / 2 : (shape.round ?? 0) / 2;

/**
 * The box a pin's artwork covers in its 100-unit drawing space: every part,
 * its transform and its own stroke weight included, before any metal outline.
 */
export function measurePinGlyph(glyph: PinGlyph): PinBounds {
  const extents = [...glyph.shapes, ...(glyph.solid ?? [])].flatMap((shape) => {
    const pad = padding(shape);
    return applyTransform(samplePath(shape.d), shape.transform).flatMap(
      ([x, y]) => [
        [x - pad, y - pad],
        [x + pad, y + pad],
      ],
    );
  });
  const xs = extents.map(([x]) => x ?? 0);
  const ys = extents.map(([, y]) => y ?? 0);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return {
    x,
    y,
    width: Math.max(...xs) - x,
    height: Math.max(...ys) - y,
  };
}
