import { describe, expect, it } from 'vitest';
import { toInsightsOpenSource } from './toInsightsOpenSource.ts';

describe('toInsightsOpenSource', () => {
  it('should be the card for a link followed on the page', () => {
    expect(toInsightsOpenSource('link')).toBe('card');
  });

  it('should be a link when the page loaded with the drawer open', () => {
    expect(toInsightsOpenSource('enter')).toBe('link');
  });

  it('should be a link for history and programmatic navigation', () => {
    expect(toInsightsOpenSource('popstate')).toBe('link');
    expect(toInsightsOpenSource('goto')).toBe('link');
  });
});
