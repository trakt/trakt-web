import { describe, expect, it } from 'vitest';
import { resolveItemCardStyle } from './resolveItemCardStyle.ts';

describe('util: resolveItemCardStyle', () => {
  describe('with large screen cards enabled', () => {
    it('should upgrade a summary card to a cover card', () => {
      expect(resolveItemCardStyle('summary', true)).toBe('cover');
    });

    it('should keep the drawer compact layout as a summary card', () => {
      expect(resolveItemCardStyle('compact', true)).toBe('summary');
    });

    it('should keep the drawer minimal layout as a summary card', () => {
      expect(resolveItemCardStyle('minimal', true)).toBe('summary');
    });

    it('should leave a cover card untouched', () => {
      expect(resolveItemCardStyle('cover', true)).toBe('cover');
    });
  });

  describe('with large screen cards disabled', () => {
    it('should leave a summary card untouched', () => {
      expect(resolveItemCardStyle('summary', false)).toBe('summary');
    });

    it('should leave a cover card untouched', () => {
      expect(resolveItemCardStyle('cover', false)).toBe('cover');
    });

    it.each(['compact', 'minimal'] as const)(
      'should resolve the %s layout to a summary card',
      (style) => {
        expect(resolveItemCardStyle(style, false)).toBe('summary');
      },
    );
  });
});
