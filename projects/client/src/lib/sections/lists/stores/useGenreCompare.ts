import { useUser } from '$lib/features/auth/stores/useUser.ts';
import type { MediaSummary } from '$lib/sections/summary/components/MediaSummary.ts';

export function useGenreCompare() {
  const { current } = useUser();
  const { genres } = current();

  function compare(left: MediaSummary, right: MediaSummary) {
    const yearDifference = left.airedDate.getFullYear() -
      right.airedDate.getFullYear();

    if (yearDifference !== 0) {
      return yearDifference;
    }

    const genreLeft = genres.findIndex((g) => left.genres.includes(g));
    const genreRight = genres.findIndex((g) => right.genres.includes(g));

    return genreRight - genreLeft;
  }

  return {
    compare,
  };
}
