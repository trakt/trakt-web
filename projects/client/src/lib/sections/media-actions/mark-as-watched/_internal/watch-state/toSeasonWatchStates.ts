import type { WatchedShow } from '$lib/features/auth/queries/currentUserWatchedShowsQuery.ts';
import type { Season } from '$lib/requests/models/Season.ts';
import type { SeasonWatchState } from './SeasonWatchState.ts';

type ToSeasonWatchStatesProps = {
  seasons: ReadonlyArray<Season>;
  watchedShow: WatchedShow | Nil;
};

function bySeasonOrder(a: Season, b: Season) {
  return a.number - b.number;
}

export function toSeasonWatchStates({
  seasons,
  watchedShow,
}: ToSeasonWatchStatesProps): SeasonWatchState[] {
  const episodes = watchedShow?.episodes ?? [];

  return seasons.toSorted(bySeasonOrder).map((season) => {
    const watchedEpisodeIds = new Set(
      episodes
        .filter((episode) => episode.season === season.number)
        .map((episode) => episode.episodeId),
    );

    const aired = season.episodes.aired;
    const watched = Math.min(watchedEpisodeIds.size, aired);

    return {
      number: season.number,
      watched,
      aired,
      total: season.episodes.count,
      progress: aired === 0 ? 0 : (watched / aired) * 100,
      isComplete: aired > 0 && watched >= aired,
      watchedEpisodeIds,
    };
  });
}
