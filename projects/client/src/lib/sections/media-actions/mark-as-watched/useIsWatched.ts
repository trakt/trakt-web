import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { findPendingOverride } from '$lib/features/offline/findPendingOverride.ts';
import { isAddEndpoint } from '$lib/features/offline/isAddEndpoint.ts';
import type { OfflineAction } from '$lib/features/offline/models/OfflineAction.ts';
import { toMediaKey } from '$lib/features/offline/toMediaKey.ts';
import { useOfflineActions } from '$lib/features/offline/useOfflineActions.ts';
import { combineLatest, map, shareReplay } from 'rxjs';
import type { ExtendedMediaStoreProps } from '../../../models/MediaStoreProps.ts';

export type IsWatchedProps = ExtendedMediaStoreProps;

export function useIsWatched(props: IsWatchedProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { history } = useUser();
  const { actions } = useOfflineActions();

  // Offline actions are queued per movie/show/episode; season marks are
  // enqueued as their show payload, so seasons keep the plain server state.
  const findPendingWatchState = (
    $actions: OfflineAction[],
  ): { isWatched: boolean; isPartiallyWatched: boolean } | null => {
    if (type === 'season') {
      return null;
    }

    const pending = findPendingOverride({
      actions: $actions,
      domain: 'history',
      keys: media.map((item) => toMediaKey(type, item.id)),
    });

    if (!pending) {
      return null;
    }

    return {
      isWatched: isAddEndpoint(pending.endpoint),
      isPartiallyWatched: false,
    };
  };

  const episodes = props.type === 'episode'
    ? Array.isArray(props.media) ? props.media : [props.media]
    : [];
  const showId = 'show' in props ? props.show.id : -1;
  const seasons = props.type === 'season'
    ? Array.isArray(props.media) ? props.media : [props.media]
    : [];
  const shows = props.type === 'show'
    ? Array.isArray(props.media) ? props.media : [props.media]
    : [];

  const watchState = combineLatest([history, actions]).pipe(
    map(([$history, $actions]) => {
      const pendingState = findPendingWatchState($actions);

      if (pendingState) {
        return pendingState;
      }

      if (!$history) {
        return { isWatched: false, isPartiallyWatched: false };
      }

      switch (type) {
        case 'movie':
          return {
            isWatched: media.every((m) => $history.movies.has(m.id)),
            isPartiallyWatched: false,
          };
        case 'episode': {
          const watchedEpisodes = $history.shows.get(showId)?.episodes ?? [];

          return {
            isWatched: episodes.every((episode) =>
              watchedEpisodes.some((e) => e.episodeId === episode.id)
            ),
            isPartiallyWatched: false,
          };
        }
        case 'season': {
          const countBySeason = $history.shows.get(showId)?.playsPerSeason ??
            new Map<number, number>();

          const watchedCount = seasons.filter((season) =>
            (countBySeason.get(season.number) ?? 0) >= season.episodes.count
          ).length;

          const hasSomeCompleteSeasons = watchedCount > 0 &&
            watchedCount < seasons.length;
          const hasSomePartialSeasons = seasons.some((season) => {
            const count = countBySeason.get(season.number) ?? 0;
            return count > 0 && count < season.episodes.count;
          });

          return {
            isWatched: watchedCount === seasons.length,
            isPartiallyWatched: hasSomeCompleteSeasons || hasSomePartialSeasons,
          };
        }
        case 'show': {
          const isWatched = shows.every((show) => {
            const watchedShow = $history.shows.get(show.id);
            const episodeCount = show.episode?.count;

            if (!watchedShow || !episodeCount) {
              return false;
            }

            const watchedEpisodeCount = [
              ...watchedShow.playsPerSeason.entries(),
            ]
              .filter(([season]) =>
                season !== 0
              )
              .reduce((sum, [, count]) => sum + count, 0);

            return watchedEpisodeCount >= episodeCount;
          });

          const isPartiallyWatched = !isWatched && shows.some((show) => {
            const watchedShow = $history.shows.get(show.id);

            if (!watchedShow) {
              return false;
            }

            return [...watchedShow.playsPerSeason.entries()]
              .some(([season, count]) => season !== 0 && count > 0);
          });

          return { isWatched, isPartiallyWatched };
        }
      }
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  const isWatched = watchState.pipe(map((s) => s.isWatched));
  const isPartiallyWatched = watchState.pipe(map((s) => s.isPartiallyWatched));

  return { isWatched, isPartiallyWatched };
}
