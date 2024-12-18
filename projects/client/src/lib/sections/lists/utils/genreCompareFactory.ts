import type { Genre } from '$lib/api.ts';
import type { MediaSummary } from '$lib/sections/summary/components/MediaSummary.ts';

type Direction = 'asc' | 'desc';
export type MediaSummarySortInfo = Pick<MediaSummary, 'airedDate' | 'genres'>;

type CompareProps = {
  left: MediaSummarySortInfo;
  right: MediaSummarySortInfo;
};

type GenreCompareProps = CompareProps & {
  genres: Genre[];
};

type DirectionCompareProps = CompareProps & {
  direction: Direction;
};

const compareYear = ({
  left,
  right,
  direction,
}: DirectionCompareProps) =>
  direction === 'asc'
    ? left.airedDate.getFullYear() - right.airedDate.getFullYear()
    : right.airedDate.getFullYear() - left.airedDate.getFullYear();

const compareGenre = ({
  left,
  right,
  genres,
}: GenreCompareProps) => {
  const genreA = genres.findIndex((g) => left.genres.includes(g));
  const genreB = genres.findIndex((g) => right.genres.includes(g));

  if (genreA === genreB) return 0;

  if (genreA === -1) return 1;
  if (genreB === -1) return -1;

  // Otherwise, prioritize based on the order in the genres array
  return genreA - genreB;
};

const genreSorter = ({
  left,
  right,
  genres,
  direction,
  priority,
}: GenreCompareProps & DirectionCompareProps & {
  priority: 'genre' | 'year';
}) => {
  if (priority === 'genre') {
    const genreDifference = compareGenre({ left, right, genres });
    if (genreDifference !== 0) return genreDifference;
    return compareYear({ left, right, direction });
  }

  const yearDifference = compareYear({ left, right, direction });
  if (yearDifference !== 0) return yearDifference;
  return compareGenre({ left, right, genres });
};

export function genreCompareFactory(
  genres: Genre[],
  direction: 'asc' | 'desc',
  priority: 'genre' | 'year',
) {
  return {
    compare: (left: MediaSummarySortInfo, right: MediaSummarySortInfo) =>
      genreSorter({ left, right, genres, direction, priority }),
  };
}
