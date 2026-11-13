import { mapToEpisodeEntry } from '$lib/requests/_internal/mapToEpisodeEntry.ts';
import { mapToMovieEntry } from '$lib/requests/_internal/mapToMovieEntry.ts';
import { mapToShowEntry } from '$lib/requests/_internal/mapToShowEntry.ts';
import type {
  NowPlayingAction,
  NowPlayingItem,
} from '$lib/requests/models/NowPlayingItem.ts';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import type { WatchingResponse } from '@trakt/api';

function mapToActionType(action: string): NowPlayingAction {
  switch (action) {
    case 'checkin':
    case 'scrobble':
      return action as NowPlayingAction;
    default:
      throw new Error(`Unknown action type: ${action}`);
  }
}

export function mapToNowPlayingItem(
  response: WatchingResponse,
): NowPlayingItem {
  const commonProps = {
    startedAt: new Date(response.started_at),
    expiresAt: new Date(response.expires_at),
    action: mapToActionType(response.action),
  };

  if (response.type === 'episode') {
    const show = assertDefined(
      response.show,
      'Show entry is missing in watching response.',
    );
    const episode = assertDefined(
      response.episode,
      'Episode entry is missing in watching response.',
    );
    return {
      ...commonProps,
      show: mapToShowEntry(show),
      media: mapToEpisodeEntry(episode),
      type: 'episode',
    };
  }

  return {
    ...commonProps,
    media: mapToMovieEntry(
      assertDefined(
        response.movie,
        'Movie entry is missing in watching response.',
      ),
    ),
    type: 'movie',
  };
}
