import type { ShowResponse } from '@trakt/api';

export function mapToEpisodeCount(show: ShowResponse) {
  return {
    episode: {
      count: show.aired_episodes ?? NaN,
    },
  };
}
