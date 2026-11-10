import { PersonStreepAwardsMappedMock } from '$mocks/data/awards/mapped/PersonStreepAwardsMappedMock.ts';
import { describe, expect, it } from 'vitest';
import { toAwardDecades } from './toAwardDecades.ts';

describe('util: toAwardDecades', () => {
  it('should group a career by decade, newest first', () => {
    const decades = toAwardDecades(PersonStreepAwardsMappedMock);

    expect(
      decades.map(({ decade, wins, entries }) => ({
        decade,
        wins,
        count: entries.length,
      })),
    ).to.deep.equal([
      { decade: 2010, wins: 1, count: 6 },
      { decade: 2000, wins: 0, count: 4 },
      { decade: 1990, wins: 0, count: 3 },
      { decade: 1980, wins: 2, count: 7 },
      { decade: 1970, wins: 0, count: 1 },
    ]);
  });

  it('should sort entries newest first inside a decade', () => {
    const [latest] = toAwardDecades(PersonStreepAwardsMappedMock);

    expect(latest?.entries.map((entry) => entry.year)).to.deep.equal([
      2018, 2017, 2015, 2014, 2012, 2010,
    ]);
  });
});
