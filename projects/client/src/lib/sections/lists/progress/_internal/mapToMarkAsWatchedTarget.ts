import type { MovieStartEntry } from '$lib/requests/models/MovieProgressEntry.ts';
import type { UpNextStartEntry } from '$lib/requests/models/UpNextEntry.ts';
import type { MarkAsWatchedStoreProps } from '../../../media-actions/mark-as-watched/useMarkAsWatched.ts';

export function mapToMarkAsWatchedTarget(
  entry: MovieStartEntry | UpNextStartEntry,
): MarkAsWatchedStoreProps {
  if ('episode' in entry) {
    return {
      type: 'show' as const,
      media: {
        id: entry.id,
        effectiveReleaseDate: entry.effectiveReleaseDate,
        seasons: [
          {
            number: entry.episode.season,
            episodes: [{ number: entry.episode.number }],
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
