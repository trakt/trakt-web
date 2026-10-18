import { sum } from '$lib/utils/number/sum.ts';

type Media = { id: number; type: 'movie' | 'show'; runtime: number };

export function toMixtapeTotals(
  media: ReadonlyArray<Media>,
  matchOf: (id: number) => number | null,
) {
  const matches = media.flatMap(({ id }) => {
    const match = matchOf(id);
    return match == null ? [] : [match];
  });
  const isAllMovies =
    media.length > 0 && media.every(({ type }) => type === 'movie');

  return {
    minutes: isAllMovies ? sum(media.map(({ runtime }) => runtime)) : null,
    match:
      matches.length > 0 ? Math.round(sum(matches) / matches.length) : null,
  };
}
