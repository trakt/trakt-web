import {
  type AvailableLanguage,
  getLanguageAndRegion,
  languageTag,
} from '$lib/features/i18n/index.ts';
import type { CreateQueryOptions } from '$lib/features/query/types.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import { EMPTY_CREW } from '$lib/requests/_internal/mapToMediaCrew.ts';
import type { MediaCrew } from '$lib/requests/models/MediaCrew.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaIntl } from '$lib/requests/models/MediaIntl.ts';
import { findRegionalIntl } from '$lib/utils/media/findRegionalIntl.ts';
import { toLoadingState } from '$lib/utils/requests/toLoadingState.ts';
import { combineLatest, type Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type IntlQueryParams = {
  slug: string;
  language: AvailableLanguage;
  enabled: boolean;
};

export type MediaGlanceQueries<T extends MediaEntry> = {
  type: T['type'];
  summary: (params: { slug: string }) => CreateQueryOptions<T, Error>;
  people: (
    params: { slug: string },
  ) => CreateQueryOptions<MediaCrew, Error>;
  intl: (
    params: IntlQueryParams,
  ) => CreateQueryOptions<Array<MediaIntl>, Error>;
};

export function useMediaGlance<T extends MediaEntry>(
  slug$: Observable<string>,
  queries: MediaGlanceQueries<T>,
) {
  const { user, history } = useUser();

  const isHistoryPending = combineLatest([user, history]).pipe(
    map(([$user, $history]) => $user != null && $history == null),
  );

  const isLocaleSkipped = languageTag() === 'en';
  const { language } = getLanguageAndRegion();

  const summary = useQuery(
    slug$.pipe(map((slug) => queries.summary({ slug }))),
  );

  const crew = useQuery(
    slug$.pipe(map((slug) => queries.people({ slug }))),
  );

  const intl = useQuery(
    slug$.pipe(
      map((slug) =>
        queries.intl({ slug, language, enabled: !isLocaleSkipped })
      ),
    ),
  );

  return {
    media: summary.pipe(map(($summary) => $summary.data)),
    crew: crew.pipe(map(($crew) => $crew.data ?? EMPTY_CREW)),
    intl: combineLatest([intl, summary]).pipe(
      map(([$intl, $summary]) =>
        findRegionalIntl({
          type: queries.type,
          translations: $intl.data,
          fallback: $summary.data,
        })
      ),
    ),
    isLoading: combineLatest([summary, crew, isHistoryPending]).pipe(
      map(([$summary, $crew, $isHistoryPending]) =>
        toLoadingState($summary) ||
        $summary.data == null ||
        toLoadingState($crew) ||
        $isHistoryPending
      ),
    ),
  };
}
