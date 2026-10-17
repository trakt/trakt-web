import type { BulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import type { Observable } from 'rxjs';

type OverlayableList<T> = {
  list: Observable<T[]>;
  isLoading: Observable<boolean>;
};

export function withListOverlay<T, R extends OverlayableList<T>>(
  { list, isLoading, ...rest }: R,
  overlay: BulkIntlOverlay<T>,
) {
  return {
    list: list.pipe(overlay.operator),
    isLoading: withOverlayLoading(isLoading, overlay.intlLoading$),
    ...rest,
  };
}
