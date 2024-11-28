import { describe, expect, it } from 'vitest';
import { toHumanNumber } from './toHumanNumber.ts';

describe('toHumanNumber', () => {
  describe('locale: en', () => {
    it('will format 3000 as 3K', () => {
      expect(toHumanNumber(3000)).toBe('3K');
    });

    it('will format 3000000 as 3M', () => {
      expect(toHumanNumber(3000000)).toBe('3M');
    });

    it('will format 3000000000 as 3B', () => {
      expect(toHumanNumber(3000000000)).toBe('3B');
    });

    it('will format 3000000000000 as 3T', () => {
      expect(toHumanNumber(3000000000000)).toBe('3T');
    });

    it('will format 4217 as 4.2K', () => {
      expect(toHumanNumber(4217)).toBe('4.2K');
    });

    it('will format 4217000 as 4.2M', () => {
      expect(toHumanNumber(4217000)).toBe('4.2M');
    });

    it('will format 4217000000 as 4.2B', () => {
      expect(toHumanNumber(4217000000)).toBe('4.2B');
    });

    it('will format 4217000000000 as 4.2T', () => {
      expect(toHumanNumber(4217000000000)).toBe('4.2T');
    });

    it('will format -1337 as -1.3K', () => {
      expect(toHumanNumber(-1337)).toBe('-1.3K');
    });

    it('will format -1337000 as -1.3M', () => {
      expect(toHumanNumber(-1337000)).toBe('-1.3M');
    });

    it('will format -1337000000 as -1.3B', () => {
      expect(toHumanNumber(-1337000000)).toBe('-1.3B');
    });

    it('will format -1337000000000 as -1.3T', () => {
      expect(toHumanNumber(-1337000000000)).toBe('-1.3T');
    });
  });

  describe('locale: de', () => {
    it('will format 3000 as 3000', () => {
      expect(toHumanNumber(3000, 'de')).toBe('3000');
    });

    it('will format 3000000 as 3 Mio.', () => {
      expect(toHumanNumber(3000000, 'de')).toBe('3 Mio.');
    });

    it('will format 3000000000 as 3 Mrd.', () => {
      expect(toHumanNumber(3000000000, 'de')).toBe('3 Mrd.');
    });

    it('will format 3000000000000 as 3 Bio.', () => {
      expect(toHumanNumber(3000000000000, 'de')).toBe('3 Bio.');
    });
  });

  describe('locale: fr', () => {
    it('will format 3000 as 3000', () => {
      expect(toHumanNumber(3000, 'fr')).toBe('3 k');
    });

    it('will format 3000000 as 3 M', () => {
      expect(toHumanNumber(3000000, 'fr')).toBe('3 M');
    });

    it('will format 3000000000 as 3 Md', () => {
      expect(toHumanNumber(3000000000, 'fr')).toBe('3 Md');
    });

    it('will format 3000000000000 as 3 Md', () => {
      expect(toHumanNumber(3000000000000, 'fr')).toBe('3 Bn');
    });
  });
});
