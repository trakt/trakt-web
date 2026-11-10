import { describe, expect, it } from 'vitest';
import { toPersonAwardStat } from './toPersonAwardStat.ts';

describe('util: toPersonAwardStat', () => {
  it('should show wins next to nominations', () => {
    expect(
      toPersonAwardStat({
        id: 'oscars',
        ceremony: 'oscars',
        kind: 'wins',
        wins: 3,
        nominations: 21,
      }),
    ).to.deep.equal({ count: '3 wins', text: '· 21 nominations' });
  });

  it('should show a single win', () => {
    expect(
      toPersonAwardStat({
        id: 'oscars',
        ceremony: 'oscars',
        kind: 'wins',
        wins: 1,
        nominations: 1,
      }),
    ).to.deep.equal({ count: '1 win', text: '· 1 nomination' });
  });

  it('should show nominations only', () => {
    expect(
      toPersonAwardStat({
        id: 'oscars',
        ceremony: 'oscars',
        kind: 'nominations',
        wins: 0,
        nominations: 2,
      }),
    ).to.deep.equal({ count: null, text: '2 nominations' });
  });

  it('should show a festival prize', () => {
    expect(
      toPersonAwardStat({
        id: 'venice',
        ceremony: 'venice',
        kind: 'festival',
        wins: 1,
        nominations: 1,
      }),
    ).to.deep.equal({ count: null, text: 'Golden Lion' });
  });
});
