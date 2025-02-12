import type { ShowResponse } from '$lib/api.ts';

export function mapToEpisodeCount(show: ShowResponse) {
  return {
    episode: {
      count: show.aired_episodes ?? NaN,
    },
  };
}
