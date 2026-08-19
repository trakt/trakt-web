import { page } from '$app/state';
import { useDiscover } from '$lib/features/filters/useDiscover.ts';
import { useFilter } from '$lib/features/filters/useFilter.ts';
import { useParameters } from '$lib/features/parameters/useParameters.ts';
import type { CrewPosition } from '$lib/requests/models/CrewPosition.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { combineLatest, map, type Observable, of } from 'rxjs';
import { parseRequestedPosition } from '../utils/parseRequestedPosition.ts';
import { resolveSelectedPosition } from '../utils/resolveSelectedPosition.ts';
import { useCreditsList } from './useCreditsList.ts';

type UseCreditsPositionSelectorProps = {
  slug$: Observable<string>;
  type: MediaType;
};

export function useCreditsPositionSelector({
  slug$,
  type,
}: UseCreditsPositionSelectorProps) {
  const { filterMap } = useFilter();
  const { mode } = useDiscover();
  const { url } = useParameters();

  const { credits, positions } = useCreditsList({
    type$: of(type),
    slug$,
    filter$: filterMap,
    mode$: mode,
  });

  return {
    allPositions: positions,
    selectedPosition: combineLatest([url, credits]).pipe(
      map(([$url, $credits]) =>
        resolveSelectedPosition({
          requested: parseRequestedPosition($url, type),
          credits: $credits,
        })
      ),
    ),
    buildPositionHref: (position: CrewPosition) => {
      const next = new URL(page.url.toString());
      next.searchParams.set(`${type}s`, position);
      return next.toString();
    },
  };
}
