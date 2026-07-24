import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { getShowWatchState } from '$lib/utils/media/getShowWatchState.ts';
import { map, of } from 'rxjs';

type IsStartedProps = MediaStoreProps;

export function useIsStarted(props: IsStartedProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { history } = useUser();

  if (type === 'show') {
    return {
      isStarted: history.pipe(
        map(($history) => {
          if (!$history) {
            return false;
          }

          // "started" only depends on whether any regular episode is watched,
          // so the episode count is irrelevant here.
          return media.every((m) =>
            getShowWatchState({
              watchedShow: $history.shows.get(m.id),
              episodeCount: undefined,
            }).isStarted
          );
        }),
      ),
    };
  }

  return { isStarted: of(false) };
}
