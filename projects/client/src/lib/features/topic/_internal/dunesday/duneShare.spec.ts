import { describe, expect, it } from 'vitest';
import type { FanSplit } from './FanSplit.ts';
import { duneShare } from './duneShare.ts';

const cosmetic: FanSplit = { dune: 0, doom: 0, plays: 0, source: 'cosmetic' };
const history = (dune: number, doom: number): FanSplit => ({
  dune,
  doom,
  plays: dune + doom,
  source: 'history',
});

describe('util: duneShare', () => {
  it('should split evenly for the double side without history', () => {
    expect(duneShare(cosmetic, 'double')).toBe(50);
  });

  it('should nudge the share toward the chosen side', () => {
    expect(duneShare(cosmetic, 'dune')).toBe(57);
    expect(duneShare(cosmetic, 'doom')).toBe(43);
  });

  it('should ignore the counts while the source is cosmetic', () => {
    expect(duneShare({ ...cosmetic, dune: 40, doom: 0 }, 'double')).toBe(50);
  });

  it('should smooth the history counts by one play per side', () => {
    expect(duneShare(history(3, 3), 'double')).toBe(50);
    expect(duneShare(history(9, 0), 'double')).toBe(91);
    expect(duneShare(history(0, 9), 'double')).toBe(9);
  });

  it('should clamp the share between 8 and 92 percent', () => {
    expect(duneShare(history(900, 0), 'dune')).toBe(92);
    expect(duneShare(history(0, 900), 'doom')).toBe(8);
  });
});
