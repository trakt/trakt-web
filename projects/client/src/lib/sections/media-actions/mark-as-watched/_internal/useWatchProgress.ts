import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { toArray } from '$lib/utils/array/toArray.ts';
import { getShowWatchState } from '$lib/utils/media/getShowWatchState.ts';
import { distinctUntilChanged, map, of } from 'rxjs';

const PROGRESS_STEP = 10;

function toProgressStep({
  watched,
  total,
}: {
  watched: number;
  total: number;
}) {
  if (total <= 0) {
    return 0;
  }

  const percentage = Math.min(watched / total, 1) * 100;
  return Math.floor(percentage / PROGRESS_STEP) * PROGRESS_STEP;
}

export function useWatchProgress(props: MediaStoreProps) {
  if (props.type !== 'show') {
    return { progress: of(undefined) };
  }

  const shows = toArray(props.media);
  const { history } = useUser();

  const progress = history.pipe(
    map(($history) => {
      if (!$history) {
        return 0;
      }

      const counts = shows.map((show) => {
        const total = show.episode?.count ?? 0;
        const { watchedEpisodeCount } = getShowWatchState({
          watchedShow: $history.shows.get(show.id),
          episodeCount: total,
        });

        return { watched: Math.min(watchedEpisodeCount, total), total };
      });

      return toProgressStep({
        watched: counts.reduce((sum, count) => sum + count.watched, 0),
        total: counts.reduce((sum, count) => sum + count.total, 0),
      });
    }),
    distinctUntilChanged(),
  );

  return { progress };
}
