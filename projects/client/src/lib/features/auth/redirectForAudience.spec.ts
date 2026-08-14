import { isRedirect } from '@sveltejs/kit';
import { describe, expect, it } from 'vitest';
import { redirectForAudience } from './redirectForAudience.ts';

const FRESH_SESSION = { token: 'token', expiresAt: 2_000_000 };
const LAPSED_SESSION = { token: 'token', expiresAt: 1_000_000 };

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
    it('should send an unauthorized viewer to the landing page', () => {
      expect(
        captureRedirect({
          audience: 'authenticated',
          oidcAuth: null,
          search: '',
          isDataRequest: false,
        }),
      ).toEqual({ status: 307, location: '/' });
    });

    it('should keep a viewer whose access token has lapsed', () => {
      expect(
        captureRedirect({
          audience: 'authenticated',
          oidcAuth: LAPSED_SESSION,
          search: '',
          isDataRequest: false,
        }),
      ).toBeNull();
    });

    it('should preserve the query string', () => {
      expect(
        captureRedirect({
          audience: 'authenticated',
          oidcAuth: null,
          search: '?mode=show',
          isDataRequest: false,
        }),
      ).toEqual({ status: 307, location: '/?mode=show' });
    });

    it('should let an authorized viewer through', () => {
      expect(
        captureRedirect({
          audience: 'authenticated',
          oidcAuth: FRESH_SESSION,
          search: '',
          isDataRequest: false,
        }),
      ).toBeNull();
    });
  });

  describe('for a public page', () => {
    it('should send an authorized viewer to the dashboard', () => {
      expect(
        captureRedirect({
          audience: 'public',
          oidcAuth: FRESH_SESSION,
          search: '',
          isDataRequest: false,
        }),
      ).toEqual({ status: 307, location: '/home' });
    });

    it('should preserve the query string', () => {
      expect(
        captureRedirect({
          audience: 'public',
          oidcAuth: FRESH_SESSION,
          search: '?utm_source=newsletter',
          isDataRequest: false,
        }),
      ).toEqual({ status: 307, location: '/home?utm_source=newsletter' });
    });

    it('should let an unauthorized viewer through', () => {
      expect(
        captureRedirect({
          audience: 'public',
          oidcAuth: null,
          search: '',
          isDataRequest: false,
        }),
      ).toBeNull();
    });

    it('should send a viewer whose access token has lapsed to the dashboard', () => {
      expect(
        captureRedirect({
          audience: 'public',
          oidcAuth: LAPSED_SESSION,
          search: '',
          isDataRequest: false,
        }),
      ).toEqual({ status: 307, location: '/home' });
    });

    it('should let a viewer with no token through', () => {
      expect(
        captureRedirect({
          audience: 'public',
          oidcAuth: { token: null, expiresAt: null },
          search: '',
          isDataRequest: false,
        }),
      ).toBeNull();
    });
  });

  describe('for a client side navigation', () => {
    it('should leave an authenticated page to the client guard', () => {
      expect(
        captureRedirect({
          audience: 'authenticated',
          oidcAuth: null,
          search: '',
          isDataRequest: true,
        }),
      ).toBeNull();
    });

    it('should leave a public page to the client guard', () => {
      expect(
        captureRedirect({
          audience: 'public',
          oidcAuth: FRESH_SESSION,
          search: '',
          isDataRequest: true,
        }),
      ).toBeNull();
    });
  });
});
