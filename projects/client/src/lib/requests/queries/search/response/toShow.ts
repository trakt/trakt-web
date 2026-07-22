import { unixToDateTime } from '../../../../utils/date/unixToDateTime.ts';
import type { ShowSchema } from '../../../search/schema/ShowSchema.ts';
import { toCommonMedia } from './toCommonMedia.ts';

export function toShow(input: ShowSchema & { slug: string }) {
  const common = toCommonMedia(input);

  return {
    ...common,
    first_aired: unixToDateTime(input.first_aired),
    aired_episodes: input.aired_episode_count,
  };
}
