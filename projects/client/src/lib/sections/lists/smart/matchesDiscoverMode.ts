import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import type { SmartListMediaType } from '$lib/requests/models/SmartListMediaType.ts';
import { toDiscoverMode } from './toDiscoverMode.ts';

type MatchesDiscoverModeProps = {
  mediaType: SmartListMediaType;
  mode: DiscoverMode;
};

export function matchesDiscoverMode(
  { mediaType, mode }: MatchesDiscoverModeProps,
): boolean {
  return mode === 'media' || toDiscoverMode(mediaType) === mode;
}
