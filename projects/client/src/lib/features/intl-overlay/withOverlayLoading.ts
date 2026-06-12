import { combineLatest, map, type Observable } from 'rxjs';

/**
 * Combines a list composable's `baseLoading` observable with the
 * bulk intl overlay's `intlLoading$` so the caller stays in a
 * loading state until both the base query and the localization
 * fetch settle. Without this, callers would flip `isLoading=false`
 * once the base query lands and briefly render the English titles
 * before the overlay swaps them out.
 */
export function withOverlayLoading(
  baseLoading$: Observable<boolean>,
  intlLoading$: Observable<boolean>,
): Observable<boolean> {
  return combineLatest([baseLoading$, intlLoading$]).pipe(
    map(([baseLoading, intlLoading]) => baseLoading || intlLoading),
  );
}
