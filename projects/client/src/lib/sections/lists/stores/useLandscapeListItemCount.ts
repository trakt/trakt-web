import { computeVariable } from '$lib/stores/css/computeVariable.ts';
import { useVarToPixels } from '$lib/stores/css/useVarToPixels.ts';
import { combineLatest, map, type Observable } from 'rxjs';

const FALLBACK_MAX_ITEM_COUNT = 7;

/**
 * Mirrors the `dynamic-item-count` SCSS mixin for landscape lists: the number
 * of landscape card slots a list row fits at the current viewport width.
 * Non-scrollable (masked) lists render exactly this many cards.
 */
export function useLandscapeListItemCount(): Observable<number> {
  const maxCount = Number(computeVariable('--max-list-landscape-item-count')) ||
    FALLBACK_MAX_ITEM_COUNT;

  const innerWidth = useVarToPixels('var(--list-inner-width)', false);
  const slotWidth = useVarToPixels(
    'calc(var(--min-landscape-card-width) + var(--list-gap))',
    false,
  );

  return combineLatest([innerWidth, slotWidth]).pipe(
    map(([inner, slot]) => {
      if (inner <= 0 || slot <= 0) return maxCount;
      return Math.min(Math.max(Math.floor(inner / slot), 1), maxCount);
    }),
  );
}
