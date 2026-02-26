import { describe, expect, it } from 'vitest';
import { calculateLimitProgress } from './calculateLimitProgress.ts';

describe('util: calculateLimitProgress', () => {
  describe('free variant', () => {
    it('should calculate progress relative to free limit', () => {
      const { progress } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 5,
        variant: 'free',
      });

      expect(progress).toBe(15);
    });

    it('should cap progress at 30% when at the free limit', () => {
      const { progress } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 10,
        variant: 'free',
      });

      expect(progress).toBe(30);
    });

    it('should cap progress at 30% when over the free limit', () => {
      const { progress } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 20,
        variant: 'free',
      });

      expect(progress).toBe(30);
    });

    it('should set isOverLimit to false when under the free limit', () => {
      const { isOverLimit } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 5,
        variant: 'free',
      });

      expect(isOverLimit).toBe(false);
    });

    it('should set isOverLimit to false when at the free limit', () => {
      const { isOverLimit } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 10,
        variant: 'free',
      });

      expect(isOverLimit).toBe(false);
    });

    it('should set isOverLimit to true when over the free limit', () => {
      const { isOverLimit } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 11,
        variant: 'free',
      });

      expect(isOverLimit).toBe(true);
    });

    it('should return limitedPercentage of 30', () => {
      const { limitedPercentage } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 5,
        variant: 'free',
      });

      expect(limitedPercentage).toBe(30);
    });
  });

  describe('vip variant', () => {
    it('should calculate progress relative to vipLimit', () => {
      const { progress } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 50,
        variant: 'vip',
      });

      expect(progress).toBe(50);
    });

    it('should cap progress at 100% when at the vip limit', () => {
      const { progress } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 100,
        variant: 'vip',
      });

      expect(progress).toBe(100);
    });

    it('should cap progress at 100% when over the vip limit', () => {
      const { progress } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 200,
        variant: 'vip',
      });

      expect(progress).toBe(100);
    });

    it('should set isOverLimit to false when under the vip limit', () => {
      const { isOverLimit } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 50,
        variant: 'vip',
      });

      expect(isOverLimit).toBe(false);
    });

    it('should set isOverLimit to true when over the vip limit', () => {
      const { isOverLimit } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 101,
        variant: 'vip',
      });

      expect(isOverLimit).toBe(true);
    });

    it('should return limitedPercentage of undefined', () => {
      const { limitedPercentage } = calculateLimitProgress({
        freeLimit: 10,
        vipLimit: 100,
        current: 50,
        variant: 'vip',
      });

      expect(limitedPercentage).toBeUndefined();
    });
  });
});
