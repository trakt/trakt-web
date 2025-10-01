import { unixToDateTime } from '../../../../utils/date/unixToDateTime.ts';
import type { ShowSchema } from '../../../search/schema/ShowSchema.ts';
import { toCommonMedia } from './toCommonMedia.ts';

export function toShow(input: ShowSchema) {
  const common = toCommonMedia(input);

  return {
    ...common,
    first_aired: unixToDateTime(input.first_aired),
    aired_episodes: input.aired_episode_count,
    certification: input.certification?.toUpperCase(),
    airs: {
      day: input.air_day,
      time: input.air_time,
      timezone: input.time_zone,
    },
    network: input.network,
  };
}
