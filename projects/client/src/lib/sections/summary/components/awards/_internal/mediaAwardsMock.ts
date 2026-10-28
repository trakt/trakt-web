import type { MediaAward } from '../MediaAward.ts';

/**
 * Stand-in awards data until there is an endpoint.
 *
 * Deterministic rather than random: the same slug always produces the same
 * awards, so the header does not reshuffle between renders and a screenshot of a
 * given title is reproducible. Derived from the slug so different titles look
 * different without needing a hand-written fixture per title.
 *
 * The `NOT_AWARDED` share is the point of the seeding - plenty of titles have no
 * awards at all, and the header has to be checked against that case as much as
 * against a decorated one.
 */
const BODIES = [
  'Emmy',
  'Golden Globe',
  'BAFTA',
  'Critics Choice',
  'Peabody',
] as const;

const CATEGORIES = [
  'Outstanding Drama Series',
  'Best Lead Performance',
  'Outstanding Writing',
  'Best Cinematography',
  'Outstanding Production Design',
  'Best Original Score',
] as const;

function toSeed(slug: string): number {
  return Array.from(slug).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  );
}

/** Roughly a third of titles carry nothing, so empty states get exercised. */
function isAwarded(seed: number): boolean {
  return seed % 3 !== 0;
}

export function mediaAwardsMock(slug: string): ReadonlyArray<MediaAward> {
  const seed = toSeed(slug);

  if (!isAwarded(seed)) {
    return [];
  }

  const count = 2 + (seed % 3);

  return Array.from({ length: count }, (_, index) => {
    const offset = seed + index * 7;

    return {
      key: `${slug}-award-${index}`,
      body: BODIES[offset % BODIES.length] ?? BODIES[0],
      category: CATEGORIES[offset % CATEGORIES.length] ?? CATEGORIES[0],
      year: 2019 + (offset % 7),
      isWinner: offset % 2 === 0,
    };
  });
}
