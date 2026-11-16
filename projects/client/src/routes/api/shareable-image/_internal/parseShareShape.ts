import type { ShareType } from '$lib/features/share/models/ShareType.ts';

const SHAPES = {
  cover: 'feed',
  story: 'story',
  og: 'open-graph',
} as const satisfies Record<string, ShareType>;

type ShareShape = keyof typeof SHAPES;

type ParsedShareShape = {
  shape: ShareShape;
  shareType: ShareType;
};

function isShape(value: string): value is ShareShape {
  return Object.hasOwn(SHAPES, value);
}

export function parseShareShape(value: string | null): ParsedShareShape | null {
  const shape = value ?? 'cover';
  if (!isShape(shape)) return null;

  return { shape, shareType: SHAPES[shape] };
}
