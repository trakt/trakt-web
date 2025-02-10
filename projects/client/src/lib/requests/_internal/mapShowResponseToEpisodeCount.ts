import type { ShowResponse } from '$lib/api.ts';

export function mapShowResponseToEpisodeCount(show: ShowResponse) {
  return {
    episode: {
      count: show.aired_episodes ?? NaN,
    },
  };
}
