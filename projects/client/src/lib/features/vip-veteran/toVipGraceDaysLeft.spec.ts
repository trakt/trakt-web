import { describe, expect, it } from 'vitest';
import { toVipGraceDaysLeft } from './toVipGraceDaysLeft.ts';

const NOW = new Date('2026-10-20T12:00:00Z');

describe('util: toVipGraceDaysLeft', () => {
  it('should count the days left in the last two weeks', () => {
    expect(toVipGraceDaysLeft(new Date('2026-11-01T12:00:00Z'), NOW)).to
      .equal(12);
    expect(toVipGraceDaysLeft(new Date('2026-10-20T18:00:00Z'), NOW)).to
      .equal(1);
  });

  it('should stay quiet more than two weeks out', () => {
    expect(toVipGraceDaysLeft(new Date('2026-11-05T12:00:00Z'), NOW)).to
      .equal(null);
  });

  it('should stay quiet once the grace has ended', () => {
    expect(toVipGraceDaysLeft(new Date('2026-10-19T12:00:00Z'), NOW)).to
      .equal(null);
  });

  it('should stay quiet without a grace end', () => {
    expect(toVipGraceDaysLeft(null, NOW)).to.equal(null);
  });
});
