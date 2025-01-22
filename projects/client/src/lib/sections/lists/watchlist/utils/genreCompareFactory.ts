import type { Genre } from '$lib/api.ts';
import type { MediaEntry } from '$lib/requests/models/MediaEntry';

type Direction = 'asc' | 'desc';
export type MediaSummarySortInfo = Pick<MediaEntry, 'airDate' | 'genres'>;

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

const compareDate = ({
  left,
  right,
  direction,
}: DirectionCompareProps) =>
  direction === 'asc'
    ? left.airDate.getTime() - right.airDate.getTime()
    : right.airDate.getTime() - left.airDate.getTime();

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
    return compareDate({ left, right, direction });
  }

  const yearDifference = compareDate({ left, right, direction });
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
