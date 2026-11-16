export type LivingPosterLayerRole = 'background' | 'mid' | 'figures' | 'title';

const ROLE_BY_SHIFT: ReadonlyArray<readonly [number, LivingPosterLayerRole]> = [
  [-1, 'background'],
  [-0.35, 'mid'],
  [0.55, 'figures'],
  [1, 'title'],
];

export function toLivingPosterLayerRole(
  shift: number,
): LivingPosterLayerRole | null {
  return ROLE_BY_SHIFT.find(([known]) => known === shift)?.[1] ?? null;
}
