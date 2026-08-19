import { describe, expect, it } from 'vitest';
import { toScreenTimeDuration } from './toScreenTimeDuration.ts';

describe('util: toScreenTimeDuration', () => {
  describe('with watch time', () => {
    it('should format hours and minutes', () => {
      expect(toScreenTimeDuration(131, 'en')).toBe('2h 11m');
    });

    it('should format minutes only', () => {
      expect(toScreenTimeDuration(45, 'en')).toBe('45m');
    });
  });

  describe('without watch time', () => {
    it('should render a zero duration instead of an empty string', () => {
      expect(toScreenTimeDuration(0, 'en')).toBe('0m');
    });

    it('should localise the zero duration', () => {
      expect(toScreenTimeDuration(0, 'de')).not.toBe('');
    });
  });
});
