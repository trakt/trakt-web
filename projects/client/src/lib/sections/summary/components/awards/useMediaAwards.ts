import type { MediaAward } from './MediaAward.ts';
import { mediaAwardsMock } from './_internal/mediaAwardsMock.ts';

type UseMediaAwardsProps = {
  slug: string;
};

/**
 * Awards for a title.
 *
 * Mock-backed for now, but shaped like the query hooks around it - takes a target,
 * returns a list, wins first - so that swapping `mediaAwardsMock` for a real query
 * is the only change needed when the endpoint lands. Callers should not have to
 * move when that happens.
 */
export function useMediaAwards({ slug }: UseMediaAwardsProps) {
  const awards = mediaAwardsMock(slug);

  /*
    Wins ahead of nominations, then most recent first. A header showing two of
    five should show the two worth bragging about.
  */
  const ranked: ReadonlyArray<MediaAward> = [...awards].sort((a, b) => {
    if (a.isWinner !== b.isWinner) {
      return a.isWinner ? -1 : 1;
    }

    return b.year - a.year;
  });

  return {
    awards: ranked,
    wins: ranked.filter((award) => award.isWinner).length,
  };
}
