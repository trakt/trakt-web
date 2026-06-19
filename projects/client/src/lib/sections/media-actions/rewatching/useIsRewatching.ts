import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaStoreProps } from '$lib/models/MediaStoreProps.ts';
import { map, of } from 'rxjs';

type IsRewatchingProps = MediaStoreProps;

export function useIsRewatching(props: IsRewatchingProps) {
  const { type } = props;
  const media = Array.isArray(props.media) ? props.media : [props.media];
  const { rewatching } = useUser();

  if (type !== 'show') {
    return { isRewatching: of(false) };
  }

  return {
    isRewatching: rewatching.pipe(
      map(($rewatching) => {
        if (!$rewatching) {
          return false;
        }

        return media.every((m) => $rewatching.shows.has(m.id));
      }),
    ),
  };
}
