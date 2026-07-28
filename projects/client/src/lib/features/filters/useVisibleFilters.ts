import { combineLatest, map } from 'rxjs';
import { useNavbarState } from '../../sections/navbar/useNavbarState.ts';
import { FILTERS } from './_internal/constants.ts';
import { isFilterVisible } from './_internal/isFilterVisible.ts';
import { useDiscover } from './useDiscover.ts';

/**
 * The filters the panel renders for the page and media type currently in view.
 * Deliberately separate from `useFilter`: that hook is called by every list
 * section for its `filterMap`, and none of them should take on the discover
 * context this one needs.
 */
export function useVisibleFilters() {
  const { state } = useNavbarState();
  const { mode } = useDiscover();

  return combineLatest([state, mode]).pipe(
    map(([$state, $mode]) =>
      FILTERS.filter((filter) =>
        isFilterVisible({
          filter,
          surface: $state.filterSurface,
          mode: $mode,
        })
      )
    ),
  );
}
