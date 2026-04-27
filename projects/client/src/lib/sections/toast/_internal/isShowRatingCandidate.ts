import {
  SHOW_BINGE_EPISODE_THRESHOLD,
  SHOW_BINGE_WINDOW,
} from '$lib/features/toast/constants/index.ts';
import type { EpisodeEntry } from '$lib/requests/models/EpisodeEntry.ts';
import { EpisodeFinaleType } from '$lib/requests/models/EpisodeType.ts';

type IsShowRatingCandidateProps = {
  episode: EpisodeEntry;
  watchDates: Date[];
  now: Date;
};

export function isShowRatingCandidate(
  { episode, watchDates, now }: IsShowRatingCandidateProps,
) {
  const bingeStart = now.getTime() - SHOW_BINGE_WINDOW;

  const isFinale = Object.values(EpisodeFinaleType).includes(
    episode.type as EpisodeFinaleType,
  );
  const isBinge = watchDates.filter(
    (date) => date.getTime() >= bingeStart,
  ).length >= SHOW_BINGE_EPISODE_THRESHOLD;

  return isFinale || isBinge;
}
