import { isRedirect } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { redirectForAudience } from './redirectForAudience.ts';

const captureRedirect = (params: Parameters<typeof redirectForAudience>[0]) => {
  try {
    redirectForAudience(params);
    return null;
  } catch (error) {
    if (!isRedirect(error)) {
      throw error;
    }

    return { status: error.status, location: error.location };
  }
};

describe('util: redirectForAudience', () => {
  describe('for an authenticated page', () => {
    it('should send a viewer without a session to the landing page', () => {
      expect(
        captureRedirect({
          audience: 'authenticated',
          hasSession: false,
          search: '',
        }),
      ).toEqual({ status: 307, location: '/' });
    });

    it('should preserve the query string', () => {
      expect(
        captureRedirect({
          audience: 'authenticated',
          hasSession: false,
          search: '?mode=show',
        }),
      ).toEqual({ status: 307, location: '/?mode=show' });
    });

    it('should let a viewer with a session through', () => {
      expect(
        captureRedirect({
          audience: 'authenticated',
          hasSession: true,
          search: '',
        }),
      ).toBeNull();
    });
  });

  describe('for a public page', () => {
    it('should send a viewer with a session to the dashboard', () => {
      expect(
        captureRedirect({
          audience: 'public',
          hasSession: true,
          search: '',
        }),
      ).toEqual({ status: 307, location: '/home' });
    });

    it('should preserve the query string', () => {
      expect(
        captureRedirect({
          audience: 'public',
          hasSession: true,
          search: '?utm_source=newsletter',
        }),
      ).toEqual({ status: 307, location: '/home?utm_source=newsletter' });
    });

    it('should let a viewer without a session through', () => {
      expect(
        captureRedirect({
          audience: 'public',
          hasSession: false,
          search: '',
        }),
      ).toBeNull();
    });
  });
});
