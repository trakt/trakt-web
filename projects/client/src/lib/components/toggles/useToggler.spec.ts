import {
  resetGlobalStore,
  useToggler,
} from '$lib/components/toggles/useToggler.ts';
import { renderStore } from '$test/beds/store/renderStore.ts';
import { firstValueFrom } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';

const ACTIVITY_KEY = 'trakt_toggler_activity';

describe('useToggler', () => {
  beforeEach(() => {
    resetGlobalStore();
    localStorage.clear();
  });

  describe('initial value', () => {
    it('uses the default value when localStorage is empty', async () => {
      const { current } = await renderStore(() => useToggler('activity'));

      const value = await firstValueFrom(current);

      expect(value.value).toBe('reviews');
    });

    it('uses the stored value when localStorage has a valid option', async () => {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify('ratings'));
      const { current } = await renderStore(() => useToggler('activity'));

      const value = await firstValueFrom(current);

      expect(value.value).toBe('ratings');
    });

    it('falls back to default when stored value is not a valid option', async () => {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify('comments'));

      const { current } = await renderStore(() => useToggler('activity'));

      const value = await firstValueFrom(current);

      expect(value.value).toBe('reviews');
    });

    it('falls back to default when stored value is invalid JSON', async () => {
      localStorage.setItem(ACTIVITY_KEY, '{not valid json}');

      const { current } = await renderStore(() => useToggler('activity'));

      const value = await firstValueFrom(current);

      expect(value.value).toBe('reviews');
    });
  });

  describe('current stream', () => {
    it('emits an object with value and text', async () => {
      const { current } = await renderStore(() => useToggler('activity'));

      const emission = await firstValueFrom(current);

      expect(emission.value).toBe('reviews');
      expect(typeof emission.text).toBe('function');
    });

    it('falls back to default when BehaviorSubject holds a stale value', async () => {
      const toggler = await renderStore(() => useToggler('activity'));

      (toggler.set as (v: unknown) => void)('stale-option');
      const value = await firstValueFrom(toggler.current);

      expect(value.value).toBe('reviews');
    });
  });

  describe('set', () => {
    it('updates the emitted value', async () => {
      const { current, set } = await renderStore(() => useToggler('activity'));

      set('ratings');
      const value = await firstValueFrom(current);

      expect(value.value).toBe('ratings');
    });

    it('persists the new value to localStorage', async () => {
      const { set } = await renderStore(() => useToggler('activity'));

      set('ratings');

      expect(localStorage.getItem(ACTIVITY_KEY)).toBe(
        JSON.stringify('ratings'),
      );
    });
  });

  describe('options', () => {
    it('returns all available option values', async () => {
      const { options } = await renderStore(() => useToggler('activity'));

      expect(options.map((o) => o.value)).toEqual(['reviews', 'ratings']);
    });
  });

  describe('shared state', () => {
    it('reuses the same store across multiple calls with the same id', async () => {
      const togglerA = await renderStore(() => useToggler('activity'));
      const togglerB = await renderStore(() => useToggler('activity'));

      togglerA.set('ratings');
      const value = await firstValueFrom(togglerB.current);

      expect(value.value).toBe('ratings');
    });
  });
});
