import { describe, expect, it } from 'vitest';
import { toAwardLabel } from './toAwardLabel.ts';

describe('util: toAwardLabel', () => {
  it('should count multiple wins', () => {
    expect(
      toAwardLabel({
        id: 'oscars',
        ceremony: 'oscars',
        kind: 'wins',
        wins: 7,
        nominations: 13,
      }),
    ).to.deep.equal({ count: 7, text: 'Oscars' });
  });

  it('should name a single win', () => {
    expect(
      toAwardLabel({
        id: 'golden-globes',
        ceremony: 'golden-globes',
        kind: 'wins',
        wins: 1,
        nominations: 4,
      }),
    ).to.deep.equal({ count: null, text: 'Golden Globe winner' });
  });

  it('should name a festival prize', () => {
    expect(
      toAwardLabel({
        id: 'cannes',
        ceremony: 'cannes',
        kind: 'festival',
        wins: 1,
        nominations: 1,
      }),
    ).to.deep.equal({ count: null, text: "Palme d'Or" });
  });

  it('should count multiple nominations', () => {
    expect(
      toAwardLabel({
        id: 'oscars',
        ceremony: 'oscars',
        kind: 'nominations',
        wins: 0,
        nominations: 2,
      }),
    ).to.deep.equal({ count: 2, text: 'Oscar nominations' });
  });

  it('should name a single nomination', () => {
    expect(
      toAwardLabel({
        id: 'emmys',
        ceremony: 'emmys',
        kind: 'nominations',
        wins: 0,
        nominations: 1,
      }),
    ).to.deep.equal({ count: null, text: 'Emmy nominee' });
  });
});
