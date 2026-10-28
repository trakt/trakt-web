import type { MediaAward } from '$lib/sections/summary/components/awards/MediaAward.ts';

type UsePersonAwardsProps = {
  slug: string;
};

const CEREMONIES: ReadonlyArray<{
  body: string;
  categories: ReadonlyArray<string>;
}> = [
  { body: 'Oscar', categories: ['Best Actor', 'Best Supporting Actor'] },
  { body: 'Golden Globe', categories: ['Best Performance', 'Best Actor'] },
  { body: 'Emmy', categories: ['Outstanding Lead Actor', 'Outstanding Guest'] },
  { body: 'SAG Award', categories: ['Outstanding Performance', 'Ensemble'] },
  { body: 'BAFTA', categories: ['Best Leading Performance', 'Rising Star'] },
];

/*
  The same deterministic-seed trick the media awards mock uses: the slug hashes
  to a stable number, so a person keeps the same awards across visits and
  roughly a third of people have none at all - both states stay testable.
*/
function toSeed(slug: string): number {
  return [...slug].reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) % 2147483647,
    7,
  );
}

/**
 * A person's awards and nominations.
 *
 * V0 is mock-backed, exactly like the media awards it sits beside: the shape
 * is the contract, and when a people-awards endpoint ships only this file
 * changes. Winners sort first, then the most recent - the order both the
 * header pill's count and the drawer's two sections read naturally from.
 */
export function usePersonAwards(
  { slug }: UsePersonAwardsProps,
): { awards: ReadonlyArray<MediaAward> } {
  const seed = toSeed(slug);

  if (seed % 3 === 0) {
    return { awards: [] };
  }

  const count = (seed % 5) + 1;

  const awards = Array.from({ length: count }, (_, index) => {
    const pick = (seed + index * 17) % CEREMONIES.length;
    const ceremony = CEREMONIES[pick] ?? CEREMONIES[0];
    const category = ceremony.categories[(seed + index) % 2] ??
      ceremony.categories[0];

    return {
      key: `${slug}-award-${index}`,
      body: ceremony.body,
      category,
      year: 2018 + ((seed + index * 3) % 8),
      /* Winning is rarer than being shortlisted, here as in life. */
      isWinner: (seed + index) % 3 === 0,
    };
  });

  return {
    awards: [...awards].sort((a, b) =>
      Number(b.isWinner) - Number(a.isWinner) || b.year - a.year
    ),
  };
}
