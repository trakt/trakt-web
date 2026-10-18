import { describe, expect, it } from 'vitest';
import { toOpenSource } from './toOpenSource.ts';

describe('toOpenSource', () => {
  it('should be the overview for a link followed on the Today page', () => {
    expect(toOpenSource({ navigationType: 'link', routeId: '/today' })).toBe(
      'overview',
    );
  });

  it('should be the navbar for a link followed anywhere else', () => {
    expect(toOpenSource({ navigationType: 'link', routeId: '/home' })).toBe(
      'navbar',
    );
    expect(toOpenSource({ navigationType: 'link', routeId: null })).toBe(
      'navbar',
    );
  });

  it('should be a link when the page loaded with the viewer open', () => {
    expect(toOpenSource({ navigationType: 'enter', routeId: '/today' })).toBe(
      'link',
    );
  });

  it('should be a link for history and programmatic navigation', () => {
    expect(
      toOpenSource({ navigationType: 'popstate', routeId: '/today' }),
    ).toBe('link');
    expect(toOpenSource({ navigationType: 'goto', routeId: '/home' })).toBe(
      'link',
    );
  });
});
