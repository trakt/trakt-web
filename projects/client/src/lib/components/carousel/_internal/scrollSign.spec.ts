import { describe, expect, it } from 'vitest';
import { scrollSign } from './scrollSign.ts';

describe('util: scrollSign', () => {
  describe('in LTR', () => {
    it('should scroll positive toward the end', () => {
      expect(scrollSign({ target: 'end', isRtl: false })).toBe(1);
    });

    it('should scroll negative toward the start', () => {
      expect(scrollSign({ target: 'start', isRtl: false })).toBe(-1);
    });
  });

  describe('in RTL', () => {
    it('should invert and scroll negative toward the end', () => {
      expect(scrollSign({ target: 'end', isRtl: true })).toBe(-1);
    });

    it('should invert and scroll positive toward the start', () => {
      expect(scrollSign({ target: 'start', isRtl: true })).toBe(1);
    });
  });
});
