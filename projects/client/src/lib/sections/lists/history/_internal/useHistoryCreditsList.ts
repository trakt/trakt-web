import type { UserHistory } from '$lib/features/auth/queries/currentUserHistoryQuery.ts';
import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { useQuery } from '$lib/features/query/useQuery.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry.ts';
import type { MediaType } from '$lib/requests/models/MediaType.ts';
import { personMovieCreditsQuery } from '$lib/requests/queries/people/personMovieCreditsQuery.ts';
import { personShowCreditsQuery } from '$lib/requests/queries/people/personShowCreditsQuery.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { toObservable } from '$lib/utils/store/toObservable.ts';
import { combineLatest, map } from 'rxjs';
import { toLoadingState } from '../../../../utils/requests/toLoadingState.ts';

type UseHistoryCreditsListProps = {
  slug: string;
};

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
  { slug }: UseHistoryCreditsListProps,
) {
  const { history } = useUser();

  const movieQuery = useQuery(personMovieCreditsQuery({ slug }));
  const showQuery = useQuery(personShowCreditsQuery({ slug }));

  const history$ = toObservable(history);
  const movies$ = toObservable(movieQuery);
  const shows$ = toObservable(showQuery);

  const list$ = combineLatest([movies$, shows$, history$]).pipe(
    map(([movies, shows, historyResult]) => {
      if (!historyResult) {
        return [];
      }

      const movieCredits = Array.from(movies.data?.values() ?? []);
      const showCredits = Array.from(shows.data?.values() ?? []);
      const mediaCredits = [...movieCredits, ...showCredits];

      const credits = Array.from(mediaCredits.values())
        .flatMap((entries) => entries)
        .filter((credit) => isInHistory(credit.media, historyResult));

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

  return {
    list: list$,
    isLoading: combineLatest([movies$, shows$]).pipe(
      map(
        ([movies, shows]) => toLoadingState(movies) || toLoadingState(shows),
      ),
    ),
  };
}
