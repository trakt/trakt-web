import type { RealityCheck } from '$lib/requests/models/RealityCheck.ts';

export function hasUnclearTier(
  realityCheck: Pick<RealityCheck, 'story' | 'protagonists'>,
): boolean {
  return [
    realityCheck.story,
    ...realityCheck.protagonists.map(({ tier }) => tier),
  ].includes('unclear');
}
