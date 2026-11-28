import { describe, expect, it } from 'vitest';
import { profileSlug } from './profileSlug.ts';

describe('util: profileSlug', () => {
  it('should return me for the own profile', () => {
    expect(profileSlug('/profile/me')).toBe('me');
  });

  it('should return me for a sub page of the own profile', () => {
    expect(profileSlug('/profile/me/stats')).toBe('me');
  });

  it('should return the slug of another user', () => {
    expect(profileSlug('/profile/paul-atreides')).toBe('paul-atreides');
  });

  it('should return the slug for a sub page of another user', () => {
    expect(profileSlug('/profile/paul-atreides/lists')).toBe('paul-atreides');
  });

  it('should return null for other paths', () => {
    expect(profileSlug('/movies/dune-part-three-2026')).toBeNull();
    expect(profileSlug('/')).toBeNull();
  });

  it('should return null when the profile segment has no slug', () => {
    expect(profileSlug('/profile/')).toBeNull();
  });

  it('should return null for the users short link, which redirects to the profile', () => {
    expect(profileSlug('/users/paul-atreides')).toBeNull();
  });
});
