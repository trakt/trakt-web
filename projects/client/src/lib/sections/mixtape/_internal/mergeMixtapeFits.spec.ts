import { describe, expect, it } from 'vitest';
import { mergeMixtapeFits } from './mergeMixtapeFits.ts';

describe('mergeMixtapeFits', () => {
  it('should rank deeper history matches above weaker recent ones', () => {
    const recentMarvel = [{ id: 1, score: 0.63 }, { id: 2, score: 0.57 }];
    const gladiator = [{ id: 67, score: 0.772 }];

    expect(mergeMixtapeFits(recentMarvel, gladiator).map(({ id }) => id))
      .toEqual([67, 1, 2]);
  });

  it("should keep the server's exact score when both sides have a title", () => {
    expect(
      mergeMixtapeFits([{ id: 5, score: 0.76 }], [{ id: 5, score: 0.772 }]),
    ).toEqual([{ id: 5, score: 0.772 }]);
  });

  it('should show the local fits on their own while the server is pending', () => {
    expect(mergeMixtapeFits([{ id: 1, score: 0.6 }, { id: 2, score: 0.7 }], []))
      .toEqual([{ id: 2, score: 0.7 }, { id: 1, score: 0.6 }]);
  });
});
