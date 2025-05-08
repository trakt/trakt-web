import type { MovieCheckinRequest, ShowCheckinRequest } from '@trakt/api';
import { derived, writable } from 'svelte/store';
import { AnalyticsEvent } from '../../../features/analytics/events/AnalyticsEvent.ts';
import { useTrack } from '../../../features/analytics/useTrack.ts';
import type { EpisodeEntry } from '../../../requests/models/EpisodeEntry.ts';
import { InvalidateAction } from '../../../requests/models/InvalidateAction.ts';
import type { MovieEntry } from '../../../requests/models/MovieEntry.ts';
import type { ShowEntry } from '../../../requests/models/ShowEntry.ts';
import { checkinEpisodeRequest } from '../../../requests/queries/checkin/checkinEpisodeRequest.ts';
import { checkinMovieRequest } from '../../../requests/queries/checkin/checkinMovieRequest.ts';
import { useInvalidator } from '../../../stores/useInvalidator.ts';
import { useNowPlaying } from '../../now-playing/useNowPlaying.ts';

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
      track({ type: 'episode' });
      await checkinEpisodeRequest({ body: payload });
    }

    if (type === 'movie') {
      const payload = mapToMoviePayload(props);
      track({ type: 'movie' });
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
