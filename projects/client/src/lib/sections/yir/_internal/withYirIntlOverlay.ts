import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { YirDetail } from '$lib/requests/models/YirDetail.ts';
import { map, type Observable } from 'rxjs';
import { yirDetailTargets } from './yirDetailTargets.ts';

type YirIntlOverlay = {
  detail: Observable<YirDetail | undefined>;
  isLoading: Observable<boolean>;
};

/**
 * Overlays localized media titles onto a Year/Month in Review detail by
 * driving the whole `YirDetail` through the shared bulk intl overlay (wrapped
 * as a single-element list). No-ops for English. The `isLoading` stream stays
 * truthy until both the base query and the localization fetch settle so the
 * page never flashes English titles before the overlay swaps them in.
 */
export function withYirIntlOverlay(
  detail$: Observable<YirDetail | Nil>,
  baseLoading$: Observable<boolean>,
): YirIntlOverlay {
  const overlay = createBulkIntlOverlay<YirDetail>({
    getTargets: yirDetailTargets,
  });

  return {
    detail: detail$.pipe(
      map((detail) => (detail ? [detail] : [])),
      overlay.operator,
      map((entries) => entries.at(0)),
    ),
    isLoading: withOverlayLoading(baseLoading$, overlay.intlLoading$),
  };
}
