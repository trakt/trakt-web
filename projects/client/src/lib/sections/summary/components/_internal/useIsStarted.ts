import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
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

          return media.every((m) => {
            const show = $history.shows.get(m.id);
            return show?.episodes.some((e) => e.season !== 0) ?? false;
          });
        }),
      ),
    };
  }

  return { isStarted: of(false) };
}
