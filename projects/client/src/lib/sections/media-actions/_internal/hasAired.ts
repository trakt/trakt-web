import type { MediaType } from '$lib/requests/models/MediaType.ts';

type HasAiredProps = {
  airDate: Date;
  type: MediaType | 'episode';
};

const MOVIE_AIR_DATE_BUFFER_DAYS = 7;

export function hasAired({ airDate, type }: HasAiredProps): boolean {
  const cutOffDate = new Date();
  if (type === 'movie') {
    cutOffDate.setDate(cutOffDate.getDate() + MOVIE_AIR_DATE_BUFFER_DAYS);
  }

  return airDate <= cutOffDate;
}
