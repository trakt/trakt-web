import { MovieOppenheimerAwardsMappedMock } from '$mocks/data/awards/mapped/MovieOppenheimerAwardsMappedMock.ts';
import { PersonGiamattiAwardsMappedMock } from '$mocks/data/awards/mapped/PersonGiamattiAwardsMappedMock.ts';
import { ShowShogunAwardsMappedMock } from '$mocks/data/awards/mapped/ShowShogunAwardsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toAwardGroups } from './toAwardGroups.ts';
import { toAwardSummary } from './toAwardSummary.ts';

const OFF_SEASON = new Date('2026-11-10');

describe('util: toAwardSummary', () => {
  it('should summarize wins from nominations per ceremony', () => {
    const groups = toAwardGroups({
      entries: MovieOppenheimerAwardsMappedMock,
      today: OFF_SEASON,
    });

    expect(toAwardSummary(groups)).to.deep.equal([
      {
        id: 'oscars',
        ceremony: 'oscars',
        kind: 'wins',
        wins: 7,
        nominations: 13,
      },
      {
        id: 'golden-globes',
        ceremony: 'golden-globes',
        kind: 'wins',
        wins: 5,
        nominations: 8,
      },
    ]);
  });

  it('should summarize nominations without wins', () => {
    const groups = toAwardGroups({
      entries: PersonGiamattiAwardsMappedMock,
      today: OFF_SEASON,
    });

    expect(toAwardSummary(groups)).to.deep.equal([
      {
        id: 'oscars',
        ceremony: 'oscars',
        kind: 'nominations',
        wins: 0,
        nominations: 2,
      },
    ]);
  });

  it('should summarize a festival win as the festival prize', () => {
    const [drama] = ShowShogunAwardsMappedMock;
    if (!drama) throw new Error('missing mock');

    const groups = toAwardGroups({
      entries: [
        {
          ...drama,
          ceremony: { ...drama.ceremony, key: 'cannes', slug: 'cannes' },
        },
      ],
      today: OFF_SEASON,
    });

    expect(toAwardSummary(groups)).to.deep.equal([
      {
        id: 'cannes',
        ceremony: 'cannes',
        kind: 'festival',
        wins: 1,
        nominations: 1,
      },
    ]);
  });
});
