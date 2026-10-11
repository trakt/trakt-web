import { describe, expect, it } from 'vitest';
import { isPillSuppressedPath } from './isPillSuppressedPath.ts';

describe('isPillSuppressedPath', () => {
  it.each([
    '/users/me/lists',
    '/users/me/lists/',
    '/users/harry/lists/view/personal',
    '/users/me/lists/silos',
  ])('suppresses %s', (pathname) => {
    expect(isPillSuppressedPath(pathname)).toBe(true);
  });

  it.each([
    '/',
    '/discover',
    '/users/me/library',
    '/users/me/lists/view/liked',
    '/users/me/lists/view/collaborations',
    '/users/me/lists/silos/extra',
    '/lists/smart/view/silos',
  ])('keeps the pill on %s', (pathname) => {
    expect(isPillSuppressedPath(pathname)).toBe(false);
  });
});
