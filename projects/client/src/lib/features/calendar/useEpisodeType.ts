import { useToggler } from '$lib/components/toggles/useToggler.ts';
import { useDiscover } from '$lib/features/filters/useDiscover.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { combineLatest, distinctUntilChanged, map } from 'rxjs';
import type { EpisodeTypeFilter } from './models/EpisodeTypeFilter.ts';

export function useEpisodeType() {
  const { options, set, current } = useToggler('episodeType');
  const { mode } = useDiscover();

  const episodeType = combineLatest([current, mode]).pipe(
    map(([$current, $mode]): EpisodeTypeFilter =>
      $mode === 'movie' ? 'all' : $current.value
    ),
    distinctUntilChanged(),
  );

  const currentOption = episodeType.pipe(
    map((value) =>
      assertDefined(
        options.find((option) => option.value === value),
        `Invalid episode type: ${value}`,
      )
    ),
  );

  return {
    options,
    episodeType,
    current: currentOption,
    isApplicable: mode.pipe(map(($mode) => $mode !== 'movie')),
    onEpisodeTypeChange: set,
  };
}
