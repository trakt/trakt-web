import type { UserHistory } from '$lib/features/auth/stores/useCurrentUserHistory.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { DiscoverMode } from '$lib/features/filters/models/DiscoverMode.ts';
import { createBulkIntlOverlay } from '$lib/features/intl-overlay/createBulkIntlOverlay.ts';
import { makeTargets } from '$lib/features/intl-overlay/makeTargets.ts';
import { withOverlayLoading } from '$lib/features/intl-overlay/withOverlayLoading.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaCredit } from '$lib/requests/models/MediaCredits.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { personMovieCreditsQuery } from '$lib/requests/queries/people/personMovieCreditsQuery.ts';
import { personShowCreditsQuery } from '$lib/requests/queries/people/personShowCreditsQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { combineLatest, map, type Observable } from 'rxjs';
import { toLoadingState } from '../../../../utils/requests/toLoadingState.ts';

type UseHistoryCreditsListProps = {
  slug$: Observable<string>;
  filter$: Observable<Record<string, string>>;
  mode$: Observable<DiscoverMode>;
};

const mediaCreditTargets = makeTargets<MediaCredit>({
  get: (entry) => ({ id: entry.media.id, type: entry.media.type }),
  patch: (entry, title) =>
    ({ ...entry, media: { ...entry.media, title } }) as typeof entry,
});

const getHistoryMap = (history: UserHistory, type: MediaType) => {
  return type === 'movie' ? history.movies : history.shows;
};

const isInHistory = (media: MediaEntry, history: UserHistory) => {
  return getHistoryMap(history, media.type).has(media.id);
};

const getWatchedAt = (media: MediaEntry, history: UserHistory) => {
  const historyEntry = assertDefined(
    getHistoryMap(history, media.type).get(media.id),
    'Expected credits history entry to be defined',
  );

  return historyEntry.watchedAt;
};

export function useHistoryCreditsList(
  { slug$, filter$, mode$ }: UseHistoryCreditsListProps,
) {
  const { history } = useUser();

  const movieQuery = useQuery(
    combineLatest([slug$, filter$]).pipe(
      map(([slug, filter]) => personMovieCreditsQuery({ slug, filter })),
    ),
  );
  const showQuery = useQuery(
    combineLatest([slug$, filter$]).pipe(
      map(([slug, filter]) => personShowCreditsQuery({ slug, filter })),
    ),
  );

  const history$ = history;
  const movies$ = movieQuery;
  const shows$ = showQuery;

  const list$ = combineLatest([movies$, shows$, history$, mode$]).pipe(
    map(([movies, shows, historyResult, mode]) => {
      if (!historyResult) {
        return [];
      }

      const movieCredits = Array.from(movies.data?.values() ?? []);
      const showCredits = Array.from(shows.data?.values() ?? []);
      const mediaCredits = [...movieCredits, ...showCredits];

      const credits = Array.from(mediaCredits.values())
        .flatMap((entries) => entries)
        .filter((credit) =>
          isInHistory(credit.media, historyResult) &&
          (mode === 'media' || credit.media.type === mode)
        );

      const castCredits = credits.filter((credit) => credit.type === 'cast');
      const crewCredits = credits.filter((credit) => credit.type === 'crew');
      const allCredits = [...castCredits, ...crewCredits];

      const seen = new Set();
      const historyCredits = allCredits.filter((credit) => {
        if (seen.has(credit.media.id)) return false;

        seen.add(credit.media.id);
        return true;
      });

      return historyCredits.sort((entryA, entryB) => {
        const aDate = getWatchedAt(entryA.media, historyResult);
        const bDate = getWatchedAt(entryB.media, historyResult);
        return bDate.getTime() - aDate.getTime();
      });
    }),
  );

  const overlay = createBulkIntlOverlay<MediaCredit>({
    getTargets: mediaCreditTargets,
  });

  const baseLoading = combineLatest([movies$, shows$, history$]).pipe(
    map(
      ([movies, shows, history]) =>
        toLoadingState(movies) || toLoadingState(shows) || !history,
    ),
  );

  return {
    list: list$.pipe(overlay.operator),
    isLoading: withOverlayLoading(baseLoading, overlay.intlLoading$),
  };
}
