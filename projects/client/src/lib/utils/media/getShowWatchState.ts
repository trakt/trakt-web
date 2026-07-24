import type { WatchedShow } from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';
import { countWatchedEpisodes } from '$lib/utils/media/countWatchedEpisodes.ts';

type ShowWatchStateProps = {
  watchedShow: WatchedShow | Nil;
  episodeCount: number | Nil;
};

type ShowWatchState = {
  watchedEpisodeCount: number;
  isWatched: boolean;
  isStarted: boolean;
  minPlays: number;
};

const EMPTY_STATE: ShowWatchState = {
  watchedEpisodeCount: 0,
  isWatched: false,
  isStarted: false,
  minPlays: 0,
};

/**
 * Canonical show watch state, shared by every poster/status surface so they
 * never disagree. "Watched" means every regular (non-special) episode has been
 * seen at least once; a missing/zero episode count can never be "watched".
 */
export function getShowWatchState(
  { watchedShow, episodeCount }: ShowWatchStateProps,
): ShowWatchState {
  if (!watchedShow) {
    return EMPTY_STATE;
  }

  const watchedEpisodeCount = countWatchedEpisodes(watchedShow.playsPerSeason);
  const regularEpisodes = watchedShow.episodes.filter((e) => e.season !== 0);
  const minPlays = regularEpisodes.length > 0
    ? Math.min(...regularEpisodes.map((e) => e.plays))
    : 0;
  const isWatched = episodeCount != null && episodeCount > 0 &&
    watchedEpisodeCount >= episodeCount;

  return {
    watchedEpisodeCount,
    isWatched,
    isStarted: watchedEpisodeCount > 0,
    minPlays,
  };
}
