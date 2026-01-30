import { type EpisodeType } from '$lib/requests/models/EpisodeType.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';

type HasAiredProps = {
  type: ExtendedMediaType | EpisodeType;
  airDate: Date;
  status?: MediaStatus;
};

export function hasAired(props: HasAiredProps): boolean {
  if (props.type === 'movie' && Boolean(props.status)) {
    return props.status === 'released';
  }

  return props.airDate <= new Date();
}
