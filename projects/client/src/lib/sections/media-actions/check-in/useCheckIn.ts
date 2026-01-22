import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useNowPlaying } from '$lib/features/toast/useNowPlaying.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { checkinEpisodeRequest } from '$lib/requests/queries/checkin/checkinEpisodeRequest.ts';
import { checkinMovieRequest } from '$lib/requests/queries/checkin/checkinMovieRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { MovieCheckinRequest, ShowCheckinRequest } from '@trakt/api';
import { BehaviorSubject, map } from 'rxjs';
import { hasAired } from '../_internal/hasAired.ts';
import type { MarkAsWatchedStoreProps } from '../mark-as-watched/useMarkAsWatched.ts';

export type UseCheckInProps = MarkAsWatchedStoreProps;

type EpisodeProps = {
  episode: { season: number; number: number };
  show: { id: number };
};

type MovieProps = {
  id: number;
};

function mapToEpisodePayload(
  { show, episode }: EpisodeProps,
): ShowCheckinRequest {
  return {
    show: {
      ids: {
        trakt: show.id,
      },
    },
    episode: {
      season: episode.season,
      number: episode.number,
    },
  };
}

function mapToMoviePayload(media: MovieProps): MovieCheckinRequest {
  return {
    movie: {
      ids: {
        trakt: media.id,
      },
    },
  };
}

export function useCheckIn(props: UseCheckInProps) {
  const { type } = props;
  const isCheckingIn = new BehaviorSubject(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.CheckIn);

  const { nowPlaying } = useNowPlaying();

  if (Array.isArray(props.media)) {
    throw new Error('Cannot check in multiple media items at once.');
  }

  const checkin = async () => {
    if (Array.isArray(props.media)) return;
    if (type === 'show') {
      throw new Error('Cannot check in a show directly.');
    }

    isCheckingIn.next(true);
    track({ type, action: 'start' });

    switch (type) {
      case 'episode': {
        const payload = mapToEpisodePayload({
          episode: props.media,
          show: props.show,
        });
        await checkinEpisodeRequest({ body: payload });
        break;
      }
      case 'movie': {
        const payload = mapToMoviePayload(props.media);
        await checkinMovieRequest({ body: payload });
        break;
      }
    }

    await invalidate(InvalidateAction.CheckIn);

    isCheckingIn.next(false);
  };

  const isWatchable = type === 'episode'
    ? hasAired({ type: 'episode', airDate: props.media.airDate })
    : hasAired({ type: 'movie', status: props.media.status ?? 'unknown' });

  return {
    checkin,
    isCheckingIn,
    /*
      FIXME: when we can cancel a checkin, only return true if the
      now playing item is the same as the one we are checking in
    */
    isCheckedIn: nowPlaying.pipe(map(($nowPlaying) => Boolean($nowPlaying))),
    isWatchable,
  };
}
