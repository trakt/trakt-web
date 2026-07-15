import { type EpisodeType } from '$lib/requests/models/EpisodeType.ts';
import type { ExtendedMediaType } from '$lib/requests/models/ExtendedMediaType.ts';
import type { MediaStatus } from '$lib/requests/models/MediaStatus.ts';
import { time } from '$lib/utils/timing/time.ts';

type HasAiredProps = {
  type: ExtendedMediaType | EpisodeType;
  effectiveReleaseDate: Date;
  status?: MediaStatus;
};

/**
 * Grace window before an episode's air date during which it is already
 * considered aired. Covers timezone/scheduling skew so check-ins and other
 * aired-gated UI don't lag behind the actual broadcast.
 */
const episodeAirBuffer = time.hours(24);

export function hasAired(props: HasAiredProps): boolean {
  const buffer = props.type === 'episode' ? episodeAirBuffer : 0;
  const isAvailable =
    props.effectiveReleaseDate.getTime() - buffer <= Date.now();

  if (props.type === 'movie' && Boolean(props.status)) {
    return props.status === 'released' || isAvailable;
  }

  return isAvailable;
}
