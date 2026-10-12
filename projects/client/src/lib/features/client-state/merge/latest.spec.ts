import { describe, expect, it } from 'vitest';
import { latest } from './latest.ts';

describe('latest', () => {
  it('should keep the later of two timestamps', () => {
    expect(latest(10, 30)).to.equal(30);
    expect(latest(40, 30)).to.equal(40);
  });
});
