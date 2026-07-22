import { describe, expect, it } from 'vitest';
import { toggleFilterState } from './toggleFilterState.ts';

describe('util: toggleFilterState', () => {
  describe('fromValue', () => {
    it('should map an absent value to the default state', () => {
      expect(toggleFilterState.fromValue({ value: null, isInverted: false }))
        .toBe('default');
      expect(
        toggleFilterState.fromValue({ value: undefined, isInverted: true }),
      ).toBe('default');
    });

    describe('for a non-inverted filter', () => {
      it('should map "true" to on', () => {
        expect(
          toggleFilterState.fromValue({ value: 'true', isInverted: false }),
        )
          .toBe('on');
      });

      it('should map "false" to off', () => {
        expect(
          toggleFilterState.fromValue({ value: 'false', isInverted: false }),
        ).toBe('off');
      });
    });

    describe('for an inverted filter', () => {
      it('should map "false" to on', () => {
        expect(
          toggleFilterState.fromValue({ value: 'false', isInverted: true }),
        ).toBe('on');
      });

      it('should map "true" to off', () => {
        expect(toggleFilterState.fromValue({ value: 'true', isInverted: true }))
          .toBe('off');
      });
    });
  });

  describe('toValue', () => {
    it('should clear the param for the default state', () => {
      expect(toggleFilterState.toValue({ state: 'default', isInverted: false }))
        .toBeNull();
      expect(toggleFilterState.toValue({ state: 'default', isInverted: true }))
        .toBeNull();
    });

    it('should clear the param for an unknown state', () => {
      expect(toggleFilterState.toValue({ state: 'bogus', isInverted: false }))
        .toBeNull();
    });

    describe('for a non-inverted filter', () => {
      it('should map on to "true"', () => {
        expect(toggleFilterState.toValue({ state: 'on', isInverted: false }))
          .toBe('true');
      });

      it('should map off to "false"', () => {
        expect(toggleFilterState.toValue({ state: 'off', isInverted: false }))
          .toBe('false');
      });
    });

    describe('for an inverted filter', () => {
      it('should map on to "false"', () => {
        expect(toggleFilterState.toValue({ state: 'on', isInverted: true }))
          .toBe('false');
      });

      it('should map off to "true"', () => {
        expect(toggleFilterState.toValue({ state: 'off', isInverted: true }))
          .toBe('true');
      });
    });
  });

  it('should round-trip every state through both mappers', () => {
    for (const isInverted of [false, true]) {
      for (const state of ['default', 'on', 'off'] as const) {
        const value = toggleFilterState.toValue({ state, isInverted });
        expect(toggleFilterState.fromValue({ value, isInverted })).toBe(state);
      }
    }
  });
});
