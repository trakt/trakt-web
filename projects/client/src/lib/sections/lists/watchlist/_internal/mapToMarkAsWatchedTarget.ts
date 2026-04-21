import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import type { MarkAsWatchedStoreProps } from '../../../media-actions/mark-as-watched/useMarkAsWatched.ts';

export function mapToMarkAsWatchedTarget(
  entry: MovieEntry | ShowEntry,
): MarkAsWatchedStoreProps {
  if ('episode' in entry) {
    return {
      type: 'show' as const,
      media: {
        id: entry.id,
        effectiveReleaseDate: entry.effectiveReleaseDate,
        seasons: [
          {
            number: 1,
            episodes: [{ number: 1 }],
          },
        ],
      },
    };
  }

  return {
    type: entry.type,
    media: entry,
  };
}
