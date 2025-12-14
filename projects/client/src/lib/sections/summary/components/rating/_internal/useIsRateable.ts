import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { map } from 'rxjs';
import { useIsWatched } from '../../../../media-actions/mark-as-watched/useIsWatched.ts';

export type IsRateableProps = MediaStoreProps;

export function useIsRateable(props: IsRateableProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { history } = useUser();

  if (type === 'show') {
    return {
      isRateable: history.pipe(
        map(($history) => {
          if (!$history) {
            return false;
          }

          return media.every((m) => {
            const show = $history.shows.get(m.id);
            return Boolean(show?.isPartiallyWatched || show?.isWatched);
          });
        }),
      ),
    };
  }

  const { isWatched } = useIsWatched(props);
  return { isRateable: isWatched.pipe(map(($isWatched) => $isWatched)) };
}
