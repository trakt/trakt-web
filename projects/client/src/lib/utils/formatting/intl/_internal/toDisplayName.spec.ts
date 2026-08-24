import { afterEach, describe, expect, it, vi } from 'vitest';
import { toDisplayName } from './toDisplayName.ts';

describe('toDisplayName', () => {
  it('will display Romanian', () => {
    const displayName = toDisplayName({
      code: 'ro',
      languageTag: 'en',
      type: 'language',
    });

    expect(displayName).toBe('Romanian');
  });

  it('will display United States', () => {
    const displayName = toDisplayName({
      code: 'us',
      languageTag: 'en',
      type: 'region',
    });

    expect(displayName).toBe('United States');
  });

  it('will display United States', () => {
    const displayName = toDisplayName({
      code: 'us',
      languageTag: 'nl',
      type: 'region',
    });

    expect(displayName).toBe('Verenigde Staten');
  });

  it('will display Romanian', () => {
    const displayName = toDisplayName({
      code: 'ro',
      languageTag: 'ro',
      type: 'language',
    });

    expect(displayName).toBe('română');
  });

  it('will display États-Unis', () => {
    const displayName = toDisplayName({
      code: 'us',
      languageTag: 'fr',
      type: 'region',
    });

    expect(displayName).toBe('États-Unis');
  });

  it('will get the display name regardless of casing', () => {
    const displayName = toDisplayName({
      code: 'nl',
      languageTag: 'en',
      type: 'region',
    });

    expect(displayName).toBe('Netherlands');
  });

  it('will fall back to the code when it is not a valid code', () => {
    const displayName = toDisplayName({
      code: 'my random value',
      languageTag: 'en',
      type: 'region',
    });

    expect(displayName).toBe('my random value');
  });

  describe('when Intl.DisplayNames is unavailable', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('will fall back to the code', () => {
      vi.spyOn(Intl, 'DisplayNames').mockImplementation(() => {
        throw new Error('Missing locale data for ');
      });

      const displayName = toDisplayName({
        code: 'nl',
        languageTag: 'en',
        type: 'region',
      });

      expect(displayName).toBe('nl');
    });
  });
});
