import { describe, expect, it } from 'vitest';
import { splitDuration } from './splitDuration.ts';

describe('splitDuration', () => {
  describe('compact format (no space between number and unit)', () => {
    it('splits English duration', () => {
      expect(splitDuration('7d 24h 59m')).toEqual(['7d', '24h', '59m']);
    });

    it('splits partial duration (days + hours)', () => {
      expect(splitDuration('2d 4h')).toEqual(['2d', '4h']);
    });

    it('splits single unit', () => {
      expect(splitDuration('45m')).toEqual(['45m']);
    });
  });

  describe('spaced format (space between number and unit)', () => {
    it('splits Dutch duration', () => {
      expect(splitDuration('7 d 24 u 59 m')).toEqual([
        '7 d',
        '24 u',
        '59 m',
      ]);
    });

    it('splits German duration', () => {
      expect(splitDuration('7 T 24 Std 59 Min')).toEqual([
        '7 T',
        '24 Std',
        '59 Min',
      ]);
    });

    it('splits French duration', () => {
      expect(splitDuration('7 j 24 h 59 min')).toEqual([
        '7 j',
        '24 h',
        '59 min',
      ]);
    });

    it('splits Portuguese duration', () => {
      expect(splitDuration('7 d 24 h 59 min')).toEqual([
        '7 d',
        '24 h',
        '59 min',
      ]);
    });

    it('splits Spanish duration', () => {
      expect(splitDuration('7 d 24 h 59 min')).toEqual([
        '7 d',
        '24 h',
        '59 min',
      ]);
    });
  });

  describe('non-Latin scripts', () => {
    it('splits Japanese duration', () => {
      expect(splitDuration('7日 24時間 59分')).toEqual([
        '7日',
        '24時間',
        '59分',
      ]);
    });

    it('splits Chinese duration', () => {
      expect(splitDuration('7天 24小时 59分钟')).toEqual([
        '7天',
        '24小时',
        '59分钟',
      ]);
    });
  });

  describe('fallback', () => {
    it('returns original string in array when no match', () => {
      expect(splitDuration('unknown')).toEqual(['unknown']);
    });

    it('returns original string when empty', () => {
      expect(splitDuration('')).toEqual(['']);
    });
  });
});
