import { describe, expect, it } from 'vitest';
import { matchFaceSweep } from './matchFaceSweep.ts';

describe('matchFaceSweep', () => {
  it('maps the score onto half of the ring', () => {
    expect(matchFaceSweep(50)).toBe(90);
  });

  it('keeps the faces side by side at the bottom for the lowest scores', () => {
    expect(matchFaceSweep(0)).toBe(16);
    expect(matchFaceSweep(5)).toBe(16);
  });

  it('keeps the faces side by side at the top for the highest scores', () => {
    expect(matchFaceSweep(95)).toBe(164);
    expect(matchFaceSweep(100)).toBe(164);
  });
});
