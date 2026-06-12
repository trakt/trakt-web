import { useAuth } from '$lib/features/auth/stores/useAuth.ts';
import { getLanguageAndRegion, languageTag } from '$lib/features/i18n/index.ts';
import { bulkIntlQuery } from '$lib/requests/queries/intl/bulkIntlQuery.ts';
import { useQueryClient } from '@tanstack/svelte-query';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  type Observable,
  of,
  type OperatorFunction,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import type { BulkIntlOverlayOptions } from './BulkIntlOverlayOptions.ts';
import { collectIds } from './_internal/collectIds.ts';
import { mergeOverlay } from './_internal/mergeOverlay.ts';

export type BulkIntlOverlay<T> = {
  operator: OperatorFunction<T[], T[]>;
  intlLoading$: Observable<boolean>;
};

/**
 * Builds an rxjs operator that overlays localized titles on a list
 * of entries plus a sibling `intlLoading$` observable for the
 * caller's loading state. The operator drives each emission with
 * `switchMap`, so changes to the entries cancel any in-flight bulk
 * intl fetch and the operator only emits once the localized titles
 * are available for the current entries.
 */
export function createBulkIntlOverlay<T>(
  opts: BulkIntlOverlayOptions<T>,
): BulkIntlOverlay<T> {
  const isEnglish = languageTag() === 'en';

  if (isEnglish) {
    return {
      operator: (entries$) =>
        entries$.pipe(
          map((entries) => [...entries]),
          startWith([] as T[]),
        ),
      intlLoading$: of(false),
    };
  }

  const { language, region } = getLanguageAndRegion();
  const { isAuthorized } = useAuth();
  const queryClient = useQueryClient();
  const intlLoading$ = new BehaviorSubject(false);

  const operator: OperatorFunction<T[], T[]> = (entries$) =>
    entries$.pipe(
      switchMap((entries) =>
        isAuthorized.pipe(
          switchMap((authorized) => {
            const ids = collectIds(entries, opts);
            const hasIds = ids.movieIds.length > 0 ||
              ids.showIds.length > 0 ||
              ids.episodeIds.length > 0;

            if (!authorized || !hasIds) {
              intlLoading$.next(false);
              return of(mergeOverlay(entries, undefined, opts));
            }

            intlLoading$.next(true);
            const queryOptions = bulkIntlQuery({
              language,
              region,
              ...ids,
              enabled: true,
            });

            return from(queryClient.fetchQuery(queryOptions)).pipe(
              tap(() => intlLoading$.next(false)),
              map((data) => mergeOverlay(entries, data, opts)),
              // If the bulk intl call errors (network blip, server hiccup)
              // keep the stream alive and degrade to the base entries so
              // subsequent pagination / tab switches still update.
              catchError(() => {
                intlLoading$.next(false);
                return of(mergeOverlay(entries, undefined, opts));
              }),
            );
          }),
        )
      ),
      startWith([] as T[]),
    );

  return { operator, intlLoading$ };
}
