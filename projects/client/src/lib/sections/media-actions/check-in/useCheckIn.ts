import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { useNowPlaying } from '$lib/features/toast/useNowPlaying.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import { checkinEpisodeRequest } from '$lib/requests/queries/checkin/checkinEpisodeRequest.ts';
import { checkinMovieRequest } from '$lib/requests/queries/checkin/checkinMovieRequest.ts';
import { hasAired } from '$lib/utils/media/hasAired.ts';
import type { MovieCheckinRequest, ShowCheckinRequest } from '@trakt/api';
import { map } from 'rxjs';
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
  const { track } = useTrack(AnalyticsEvent.CheckIn);

  const { nowPlaying } = useNowPlaying();

  if (Array.isArray(props.media)) {
    throw new Error('Cannot check in multiple media items at once.');
  }

  const checkingIn = useMutation(defineMutation({
    key: 'media:check-in',
    request: async () => {
      if (Array.isArray(props.media)) return;

      switch (type) {
        case 'episode': {
          await checkinEpisodeRequest({
            body: mapToEpisodePayload({
              episode: props.media,
              show: props.show,
            }),
          });
          return;
        }
        case 'movie': {
          await checkinMovieRequest({ body: mapToMoviePayload(props.media) });
          return;
        }
      }
    },
    invalidations: [InvalidateAction.CheckIn],
  }));

  const checkin = async () => {
    if (Array.isArray(props.media)) return;
    if (type === 'show') {
      throw new Error('Cannot check in a show directly.');
    }

    track({ type, action: 'start' });

    await checkingIn.mutate();
  };

  const isWatchable = hasAired({
    ...props.media,
    type,
  });

  return {
    checkin,
    isCheckingIn: checkingIn.isPending,
    /*
      FIXME: when we can cancel a checkin, only return true if the
      now playing item is the same as the one we are checking in
    */
    isCheckedIn: nowPlaying.pipe(map(($nowPlaying) => Boolean($nowPlaying))),
    isWatchable,
  };
}
