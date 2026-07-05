import { describe, expect, it } from 'vitest';
import { resolveLocaleAction } from './resolveLocaleAction.ts';

const base = {
  isAuthorized: true,
  localeSource: 'cookie' as const,
};

describe('util: resolveLocaleAction', () => {
  describe('apply', () => {
    it('should apply a saved locale that differs from the active one', () => {
      expect(
        resolveLocaleAction({ ...base, saved: 'fr-FR', active: 'en' }),
      ).to.deep.equal({ type: 'apply', value: 'fr-FR' });
    });

    it('should apply regardless of authorization or locale source', () => {
      expect(
        resolveLocaleAction({
          saved: 'fr-FR',
          active: 'en',
          isAuthorized: false,
          localeSource: 'header',
        }),
      ).to.deep.equal({ type: 'apply', value: 'fr-FR' });
    });
  });

  describe('backfill', () => {
    it('should backfill the active locale when it came from the cookie and nothing is saved', () => {
      expect(
        resolveLocaleAction({ ...base, saved: undefined, active: 'fr-FR' }),
      ).to.deep.equal({ type: 'backfill', value: 'fr-FR' });
    });

    it('should not backfill for anonymous users', () => {
      expect(
        resolveLocaleAction({
          ...base,
          isAuthorized: false,
          saved: undefined,
          active: 'fr-FR',
        }),
      ).to.deep.equal({ type: 'none' });
    });

    it('should not backfill an Accept-Language fallback', () => {
      expect(
        resolveLocaleAction({
          ...base,
          localeSource: 'header',
          saved: undefined,
          active: 'fr-FR',
        }),
      ).to.deep.equal({ type: 'none' });
    });

    it('should not backfill an unknown active locale', () => {
      expect(
        resolveLocaleAction({ ...base, saved: undefined, active: 'xx-XX' }),
      ).to.deep.equal({ type: 'none' });
    });

    it('should not backfill when a locale is already saved', () => {
      expect(
        resolveLocaleAction({ ...base, saved: 'fr-FR', active: 'fr-FR' }),
      ).to.deep.equal({ type: 'none' });
    });
  });

  it('should do nothing when saved already matches active', () => {
    expect(
      resolveLocaleAction({ ...base, saved: 'fr-FR', active: 'fr-FR' }),
    ).to.deep.equal({ type: 'none' });
  });
});
