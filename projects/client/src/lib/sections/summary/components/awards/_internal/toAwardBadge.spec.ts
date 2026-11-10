import { MovieOppenheimerAwardsMappedMock } from '$mocks/data/awards/mapped/MovieOppenheimerAwardsMappedMock.ts';
import { MoviePerfectDaysAwardsMappedMock } from '$mocks/data/awards/mapped/MoviePerfectDaysAwardsMappedMock.ts';
import { PersonStreepAwardsMappedMock } from '$mocks/data/awards/mapped/PersonStreepAwardsMappedMock.ts';
import type { AwardCeremonyKey } from '$lib/requests/models/AwardCeremonyKey.ts';
import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';
import { describe, expect, it } from 'vitest';
import { toAwardBadge } from './toAwardBadge.ts';
import { toAwardGroups } from './toAwardGroups.ts';

const OFF_SEASON = new Date('2026-11-10');

function badgeFor(entries: ReadonlyArray<AwardEntry>, today = OFF_SEASON) {
  return toAwardBadge(toAwardGroups({ entries, today }));
}

function at(
  key: AwardCeremonyKey,
  won: boolean | null,
  base = MoviePerfectDaysAwardsMappedMock,
): AwardEntry[] {
  return base.map((entry) => ({
    ...entry,
    key: `${key}-${entry.key}`,
    won,
    ceremony: { ...entry.ceremony, key, slug: key, heldAt: null },
  }));
}

describe('util: toAwardBadge', () => {
  it('should pick Oscar wins first', () => {
    expect(badgeFor(MovieOppenheimerAwardsMappedMock)).to.deep.equal({
      id: 'oscars',
      ceremony: 'oscars',
      kind: 'wins',
      wins: 7,
      nominations: 13,
      isLive: false,
    });
  });

  it('should pick a festival win over Golden Globe wins', () => {
    expect(
      badgeFor([...at('golden-globes', true), ...at('venice', true)]),
    ).to.include({ ceremony: 'venice', kind: 'festival' });
  });

  it('should pick Golden Globe wins over Oscar nominations', () => {
    expect(
      badgeFor([...at('oscars', false), ...at('golden-globes', true)]),
    ).to.include({ ceremony: 'golden-globes', kind: 'wins', wins: 1 });
  });

  it('should pick Emmy wins over Creative Arts Emmy wins', () => {
    expect(
      badgeFor([...at('emmys-creative-arts', true), ...at('emmys', true)]),
    ).to.include({ ceremony: 'emmys', kind: 'wins' });
  });

  it('should fall back to nominations', () => {
    expect(badgeFor(MoviePerfectDaysAwardsMappedMock)).to.deep.equal({
      id: 'oscars',
      ceremony: 'oscars',
      kind: 'nominations',
      wins: 0,
      nominations: 1,
      isLive: false,
    });
  });

  it('should show only pending nominations while results are out', () => {
    const entries = PersonStreepAwardsMappedMock.map((entry, index) =>
      index === 0 ? { ...entry, won: null } : entry,
    );

    expect(badgeFor(entries)).to.deep.equal({
      id: 'oscars',
      ceremony: 'oscars',
      kind: 'nominations',
      wins: 0,
      nominations: 1,
      isLive: true,
    });
  });

  it('should go live right after the ceremony', () => {
    expect(
      badgeFor(MovieOppenheimerAwardsMappedMock, new Date('2024-03-12T00:00')),
    ).to.include({ ceremony: 'oscars', kind: 'wins', isLive: true });
  });

  it('should return null without awards', () => {
    expect(badgeFor([])).to.equal(null);
  });
});
