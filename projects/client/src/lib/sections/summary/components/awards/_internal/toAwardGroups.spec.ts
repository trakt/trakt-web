import { MovieOppenheimerAwardsMappedMock } from '$mocks/data/awards/mapped/MovieOppenheimerAwardsMappedMock.ts';
import { PersonStreepAwardsMappedMock } from '$mocks/data/awards/mapped/PersonStreepAwardsMappedMock.ts';
import { ShowShogunAwardsMappedMock } from '$mocks/data/awards/mapped/ShowShogunAwardsMappedMock.ts';
import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';
import { describe, expect, it } from 'vitest';
import { toAwardGroups } from './toAwardGroups.ts';

const OFF_SEASON = new Date('2026-11-10');

function withCeremony(
  entry: AwardEntry,
  ceremony: Pick<AwardEntry['ceremony'], 'key' | 'slug' | 'name'>,
): AwardEntry {
  return { ...entry, ceremony: { ...entry.ceremony, ...ceremony } };
}

describe('util: toAwardGroups', () => {
  it('should group Oppenheimer by ceremony', () => {
    const groups = toAwardGroups({
      entries: MovieOppenheimerAwardsMappedMock,
      today: OFF_SEASON,
    });

    expect(
      groups.map(({ key, name, wins, nominations, years, phase }) => ({
        key,
        name,
        wins,
        nominations,
        years,
        phase,
      })),
    ).to.deep.equal([
      {
        key: 'oscars',
        name: 'Academy Awards',
        wins: 7,
        nominations: 13,
        years: [2024],
        phase: 'none',
      },
      {
        key: 'golden-globes',
        name: 'Golden Globes',
        wins: 5,
        nominations: 8,
        years: [2024],
        phase: 'none',
      },
    ]);
  });

  it('should keep the response order inside a group', () => {
    const [oscars] = toAwardGroups({
      entries: MovieOppenheimerAwardsMappedMock,
      today: OFF_SEASON,
    });

    expect(oscars?.entries.at(0)?.category).to.equal('Best Picture');
    expect(oscars?.entries.at(-1)?.category).to.equal('Best Sound');
  });

  it('should list the years of a long career newest first', () => {
    const [oscars] = toAwardGroups({
      entries: PersonStreepAwardsMappedMock,
      today: OFF_SEASON,
    });

    expect(oscars?.years.at(0)).to.equal(2018);
    expect(oscars?.years.at(-1)).to.equal(1979);
    expect(oscars?.wins).to.equal(3);
  });

  it('should rank Creative Arts Emmys right after the Emmys', () => {
    const [drama] = ShowShogunAwardsMappedMock;
    if (!drama) throw new Error('missing mock');

    const groups = toAwardGroups({
      entries: [
        withCeremony(drama, {
          key: 'emmys-creative-arts',
          slug: 'emmys-creative-arts',
          name: 'Creative Arts Emmys',
        }),
        withCeremony(drama, {
          key: 'golden-globes',
          slug: 'golden-globes',
          name: 'Golden Globes',
        }),
        drama,
      ],
      today: OFF_SEASON,
    });

    expect(groups.map((group) => group.key)).to.deep.equal([
      'golden-globes',
      'emmys',
      'emmys-creative-arts',
    ]);
  });

  it('should put unknown ceremonies last', () => {
    const [drama] = ShowShogunAwardsMappedMock;
    if (!drama) throw new Error('missing mock');

    const groups = toAwardGroups({
      entries: [
        withCeremony(drama, { key: 'other', slug: 'baftas', name: 'BAFTA' }),
        drama,
      ],
      today: OFF_SEASON,
    });

    expect(groups.map((group) => group.key)).to.deep.equal(['emmys', 'other']);
  });

  it('should keep unknown ceremonies apart', () => {
    const [drama] = ShowShogunAwardsMappedMock;
    if (!drama) throw new Error('missing mock');

    const groups = toAwardGroups({
      entries: [
        withCeremony(drama, { key: 'other', slug: 'baftas', name: 'BAFTA' }),
        withCeremony(drama, { key: 'other', slug: 'sag', name: 'SAG' }),
      ],
      today: OFF_SEASON,
    });

    expect(
      groups.map(({ id, name, nominations }) => ({ id, name, nominations })),
    ).to.deep.equal([
      { id: 'baftas', name: 'BAFTA', nominations: 1 },
      { id: 'sag', name: 'SAG', nominations: 1 },
    ]);
  });

  it('should mark festivals', () => {
    const [drama] = ShowShogunAwardsMappedMock;
    if (!drama) throw new Error('missing mock');

    const [cannes] = toAwardGroups({
      entries: [
        withCeremony(drama, { key: 'cannes', slug: 'cannes', name: 'Cannes' }),
      ],
      today: OFF_SEASON,
    });

    expect(cannes?.isFestival).to.equal(true);
  });

  it('should return no groups without awards', () => {
    expect(toAwardGroups({ entries: [], today: OFF_SEASON })).to.deep.equal([]);
  });
});
