import type {
  LivingPosterEffect,
  PosterBox,
  PosterPoint,
} from '../models/LivingPosterEffect.ts';

type EffectField = 'color' | 'box' | 'points' | 'at' | 'mask';

const FIELDS: Record<LivingPosterEffect['kind'], ReadonlyArray<EffectField>> = {
  embers: ['color', 'box'],
  rain: [],
  lightning: [],
  twinkle: ['box'],
  fog: ['color', 'box'],
  haze: ['color'],
  snow: [],
  fireflies: [],
  dust: [],
  flicker: ['color', 'box'],
  glow: ['color', 'box'],
  bulbs: ['color', 'points'],
  flare: ['at'],
  shimmer: ['mask'],
  foil: ['mask'],
};

const FULL_BOX: PosterBox = [0, 0, 100, 100];
const MAX_POINTS = 64;
const COLOR_PATTERN = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isKind = (value: unknown): value is LivingPosterEffect['kind'] =>
  typeof value === 'string' && Object.hasOwn(FIELDS, value);

function toPoint(value: unknown): PosterPoint | null {
  if (!Array.isArray(value) || value.length !== 2) return null;

  const [x, y] = value;
  if (!isFiniteNumber(x) || !isFiniteNumber(y)) return null;

  return [x, y];
}

function toBox(value: unknown): PosterBox {
  if (!Array.isArray(value) || value.length !== 4) return FULL_BOX;
  if (!value.every(isFiniteNumber)) return FULL_BOX;

  const [x, y, width, height] = value;
  return [x, y, width, height];
}

function toColor(value: unknown): string | null {
  return typeof value === 'string' && COLOR_PATTERN.test(value) ? value : null;
}

function toPoints(value: unknown): ReadonlyArray<PosterPoint> {
  if (!Array.isArray(value)) return [];

  return value
    .slice(0, MAX_POINTS)
    .map(toPoint)
    .filter((point): point is PosterPoint => point !== null);
}

export function parseLivingPosterEffect(
  tuple: unknown,
): LivingPosterEffect | null {
  if (!Array.isArray(tuple)) return null;

  const [kind, color, intensity, box, extra] = tuple;
  if (!isKind(kind)) return null;
  if (!isFiniteNumber(intensity)) return null;

  const fields = FIELDS[kind];
  const common = {
    color: fields.includes('color') ? toColor(color) : null,
    intensity: Math.min(1, Math.max(0, intensity)),
    box: fields.includes('box') ? toBox(box) : FULL_BOX,
  };

  if (kind === 'bulbs') {
    const points = toPoints(extra);
    return points.length === 0 ? null : { ...common, kind, points };
  }

  if (kind === 'flare') {
    const at = toPoint(extra);
    return at === null ? null : { ...common, kind, at };
  }

  if (kind === 'shimmer' || kind === 'foil') {
    return extra === 'letters' || extra === 'title'
      ? { ...common, kind, mask: extra }
      : null;
  }

  return { ...common, kind };
}
