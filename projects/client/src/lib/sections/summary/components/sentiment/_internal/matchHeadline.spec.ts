import { describe, expect, it } from 'vitest';
import { matchHeadline } from './matchHeadline.ts';

const DUNE = { ids: { trakt: 1, slug: 'dune-2021' }, title: 'Dune', stars: 8 };
const DUNE_TWO = {
  ids: { trakt: 2, slug: 'dune-part-two-2024' },
  title: 'Dune: Part Two',
  stars: 10,
};
const SATIRE = { slug: 'satire', name: 'satire', label: 'Satire' };
const MONSTER = { slug: 'monster', name: 'monster', label: 'Monster' };
const ANIME = { slug: 'anime', name: 'anime', label: 'Anime' };

const BASE = {
  reasons: null,
  taste: [],
  rating: null,
  votes: 0,
  locale: 'en',
};

describe('matchHeadline', () => {
  it('should lead hype with the earlier film the user rated highest', () => {
    expect(
      matchHeadline({
        ...BASE,
        kind: 'hype',
        reasons: {
          series: { films: [DUNE, DUNE_TWO], usual: 'above' },
          lists: { top: 1 },
        },
        taste: [SATIRE],
      }),
    ).toBe('You rated Dune: Part Two 10/10.');
  });

  it('should pick the latest film when ratings tie', () => {
    expect(
      matchHeadline({
        ...BASE,
        kind: 'hype',
        reasons: {
          series: {
            films: [DUNE_TWO, { ...DUNE, title: 'Dune Messiah', stars: 10 }],
            usual: 'about',
          },
        },
      }),
    ).toBe('You rated Dune Messiah 10/10.');
  });

  it('should read well for an 8-star rating', () => {
    expect(
      matchHeadline({
        ...BASE,
        kind: 'hype',
        reasons: { series: { films: [DUNE], usual: 'about' } },
      }),
    ).toBe('You rated Dune 8/10.');
  });

  it('should fall back to taste, then lists, for hype', () => {
    expect(
      matchHeadline({
        ...BASE,
        kind: 'hype',
        reasons: { lists: { top: 1 } },
        taste: [SATIRE],
      }),
    ).toBe('Satire is your thing.');
    expect(
      matchHeadline({ ...BASE, kind: 'hype', reasons: { lists: { top: 1 } } }),
    ).toBe('One of the most listed upcoming titles.');
  });

  it('should name at most two genres for a match', () => {
    expect(
      matchHeadline({
        ...BASE,
        kind: 'match',
        taste: [SATIRE, MONSTER, ANIME],
      }),
    ).toBe('Satire and Monster are your thing.');
  });

  it('should fall back to a well rated title for a match', () => {
    expect(
      matchHeadline({ ...BASE, kind: 'match', rating: 0.72, votes: 4012 }),
    ).toBe('Trakt users rate it 72%.');
  });

  it('should say nothing without a reason', () => {
    expect(matchHeadline({ ...BASE, kind: 'hype' })).toBeNull();
    expect(
      matchHeadline({ ...BASE, kind: 'match', rating: 0.72, votes: 499 }),
    ).toBeNull();
    expect(
      matchHeadline({ ...BASE, kind: 'match', rating: 0.69, votes: 4012 }),
    ).toBeNull();
  });
});
