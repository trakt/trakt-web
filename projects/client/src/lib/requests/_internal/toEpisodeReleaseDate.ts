import { MAX_DATE } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';

type EpisodeReleaseDateParams = {
  firstAired: string | Nil;
  released: string | Nil;
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function toReleasedDate(released: string): Date {
  return DATE_ONLY_PATTERN.test(released)
    ? new Date(`${released}T12:00:00.000Z`)
    : new Date(released);
}

function isSameReleaseDay(released: string, releaseDate: Date, airDate: Date) {
  return (
    DATE_ONLY_PATTERN.test(released) &&
    airDate.getTime() - releaseDate.getTime() < time.days(1)
  );
}

export function toEpisodeReleaseDate({
  firstAired,
  released,
}: EpisodeReleaseDateParams): Date {
  const airDate = new Date(firstAired ?? MAX_DATE);
  if (!released) return airDate;

  const releaseDate = toReleasedDate(released);
  if (releaseDate.getTime() >= airDate.getTime()) return airDate;
  if (isSameReleaseDay(released, releaseDate, airDate)) return airDate;

  return releaseDate;
}
