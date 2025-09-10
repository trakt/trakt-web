import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '$lib/features/analytics/useTrack.ts';
import { useNowPlaying } from '$lib/features/toast/useNowPlaying.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { InvalidateAction } from '$lib/requests/models/InvalidateAction.ts';
import type { MovieEntry } from '$lib/requests/models/MovieEntry.ts';
import type { ShowEntry } from '$lib/requests/models/ShowEntry.ts';
import { checkinEpisodeRequest } from '$lib/requests/queries/checkin/checkinEpisodeRequest.ts';
import { checkinMovieRequest } from '$lib/requests/queries/checkin/checkinMovieRequest.ts';
import { useInvalidator } from '$lib/stores/useInvalidator.ts';
import type { MovieCheckinRequest, ShowCheckinRequest } from '@trakt/api';
import { derived, writable } from 'svelte/store';

type EpisodeProps = {
  type: 'episode';
  show: ShowEntry;
  episode: EpisodeEntry;
};

type MovieProps = {
  type: 'movie';
  media: MovieEntry;
};

export type UseCheckInProps = EpisodeProps | MovieProps;

function mapToEpisodePayload(
  { show, episode }: EpisodeProps,
): ShowCheckinRequest {
  return {
    show: {
      ids: {
        trakt: show.id,
        slug: show.slug,
      },
    },
    episode: {
      season: episode.season,
      number: episode.number,
    },
  };
}

function mapToMoviePayload({ media }: MovieProps): MovieCheckinRequest {
  return {
    movie: {
      ids: {
        trakt: media.id,
        slug: media.slug,
      },
    },
  };
}

export function useCheckIn(props: UseCheckInProps) {
  const { type } = props;
  const isCheckingIn = writable(false);
  const { invalidate } = useInvalidator();
  const { track } = useTrack(AnalyticsEvent.CheckIn);

  const { nowPlaying } = useNowPlaying();

  const checkin = async () => {
    isCheckingIn.set(true);

    if (type === 'episode') {
      const payload = mapToEpisodePayload(props);
      track({ type: 'episode', action: 'start' });
      await checkinEpisodeRequest({ body: payload });
    }

    if (type === 'movie') {
      const payload = mapToMoviePayload(props);
      track({ type: 'movie', action: 'start' });
      await checkinMovieRequest({ body: payload });
    }

    await invalidate(InvalidateAction.CheckIn);

    isCheckingIn.set(false);
  };

  const isWatchable = type === 'episode'
    ? props.episode.airDate && props.episode.airDate <= new Date()
    : props.media.airDate && props.media.airDate <= new Date();

  return {
    checkin,
    isCheckingIn,
    /*
      FIXME: when we can cancel a checkin, only return true if the
      now playing item is the same as the one we are checking in
    */
    isCheckedIn: derived(nowPlaying, ($nowPlaying) => Boolean($nowPlaying)),
    isWatchable,
  };
}
