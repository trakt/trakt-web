import type { AvailableLocale } from '$lib/features/i18n/index.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { mediaDocumentaryCheckQuery } from '$lib/requests/queries/media/mediaDocumentaryCheckQuery.ts';
import { toLoadableDocumentaryCheck } from '$lib/utils/reality/toLoadableDocumentaryCheck.ts';
import { combineLatest, type Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

type UseDocumentaryCheckParams = {
  type: MediaType;
  slug$: Observable<string>;
  genres$: Observable<MediaEntry['genres'] | undefined>;
  isAuthorized: Observable<boolean>;
  locale: AvailableLocale;
};

export function useDocumentaryCheck({
  type,
  slug$,
  genres$,
  isAuthorized,
  locale,
}: UseDocumentaryCheckParams) {
  const isDocumentary = genres$.pipe(
    map((genres) => genres?.includes('documentary')),
    distinctUntilChanged(),
  );

  return combineLatest([
    isAuthorized,
    isDocumentary,
    useQuery(
      combineLatest([slug$, isAuthorized, isDocumentary]).pipe(
        map(([slug, authorized, documentary]) =>
          mediaDocumentaryCheckQuery({
            type,
            slug,
            locale,
            enabled: authorized && documentary === true,
          }),
        ),
      ),
    ),
  ]).pipe(
    map(([authorized, documentary, query]) =>
      toLoadableDocumentaryCheck({
        isAuthorized: authorized,
        isDocumentary: documentary,
        query,
      }),
    ),
  );
}
