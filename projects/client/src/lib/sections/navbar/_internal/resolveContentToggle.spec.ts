import { resolveContentToggle } from './resolveContentToggle.ts';

import { describe, expect, it } from 'vitest';

describe('util: resolveContentToggle', () => {
  it('should resolve the search surface', () => {
    expect(resolveContentToggle('/search')).toEqual({
      surface: 'search',
      audience: 'all',
    });
  });

  it('should resolve discover surfaces, including dynamic route patterns', () => {
    const discover = { surface: 'discover', audience: 'all' };

    expect(resolveContentToggle('/')).toEqual(discover);
    expect(resolveContentToggle('/discover')).toEqual(discover);
    expect(resolveContentToggle('/users/[user]/watchlist')).toEqual(discover);
    expect(resolveContentToggle('/movies/[slug]/lists')).toEqual(discover);
    expect(resolveContentToggle('/users/[user]/lists/view/liked')).toEqual(
      discover,
    );
  });

  it('should keep public profiles member-only, matching the legacy page gate', () => {
    expect(resolveContentToggle('/profile/[slug]')).toEqual({
      surface: 'discover',
      audience: 'authenticated',
    });
  });

  it('should return null for uncovered or missing routes', () => {
    // A media detail page shows no toggle, but its /lists sub-route does - guards
    // against a pattern collision.
    expect(resolveContentToggle('/movies/[slug]')).toBeNull();
    expect(resolveContentToggle('/settings')).toBeNull();
    expect(resolveContentToggle(null)).toBeNull();
    expect(resolveContentToggle(undefined)).toBeNull();
  });
});
