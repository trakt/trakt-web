import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { bulkIntlQuery } from '$lib/requests/queries/intl/bulkIntlQuery.ts';
import {
  combineLatest,
  distinctUntilChanged,
  map,
  type OperatorFunction,
} from 'rxjs';
import type { BulkIntlOverlayOptions } from './BulkIntlOverlayOptions.ts';
import { collectIds } from './_internal/collectIds.ts';
import { idsEqual } from './_internal/idsEqual.ts';
import { mergeOverlay } from './_internal/mergeOverlay.ts';

export function withBulkIntlOverlay<T>(
  opts: BulkIntlOverlayOptions<T>,
): OperatorFunction<T[], T[]> {
  const isEnglish = languageTag() === 'en';

  if (isEnglish) {
    return (entries$) => entries$.pipe(map((entries) => [...entries]));
  }

  const { language, region } = getLanguageAndRegion();
  const { isAuthorized } = useAuth();

  return (entries$) => {
    const ids$ = entries$.pipe(
      map((entries) => collectIds(entries, opts)),
      distinctUntilChanged(idsEqual),
    );

    const options$ = combineLatest([ids$, isAuthorized]).pipe(
      map(([ids, authorized]) =>
        bulkIntlQuery({
          language,
          region,
          ...ids,
          enabled: authorized,
        })
      ),
    );

    const intl$ = useQuery(options$).pipe(map(($q) => $q.data));

    return combineLatest([entries$, intl$.pipe(distinctUntilChanged())]).pipe(
      map(([entries, intl]) => mergeOverlay(entries, intl, opts)),
    );
  };
}
