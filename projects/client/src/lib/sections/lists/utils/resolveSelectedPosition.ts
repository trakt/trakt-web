import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type { MediaCredits } from '$lib/requests/models/MediaCredits.ts';

const NON_PREFERRED_POSITIONS = new Set<CrewPosition>([
  'self',
  'narrator',
  'unknown',
]);

type ResolveSelectedPositionParams = {
  requested: CrewPosition;
  credits?: MediaCredits;
};

export function resolveSelectedPosition(
  { requested, credits }: ResolveSelectedPositionParams,
): CrewPosition {
  if (credits?.get(requested)?.length) return requested;

  const available = Array.from(credits?.entries() ?? []).filter(
    ([, list]) => list.length > 0,
  );
  if (available.length === 0) return requested;

  const preferred = available.filter(
    ([position]) => !NON_PREFERRED_POSITIONS.has(position),
  );
  const candidates = preferred.length > 0 ? preferred : available;

  return candidates.reduce((max, current) =>
    current[1].length > max[1].length ? current : max
  )[0];
}
