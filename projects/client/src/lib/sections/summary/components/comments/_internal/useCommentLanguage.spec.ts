import { renderStore } from '$test/beds/store/renderStore.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCommentLanguage } from './useCommentLanguage.svelte.ts';

vi.mock('$lib/features/i18n/index.ts', () => ({
  languageTag: () => 'en',
  availableLocales: ['en-US', 'es-ES', 'nl-NL'],
}));

const STORAGE_KEY = 'trakt-comment-language';

function navigateTo(search: string) {
  globalThis.history.replaceState({}, '', `/movies/heretic${search}`);
}

function loadHook() {
  return renderStore(() => useCommentLanguage());
}

describe('store: useCommentLanguage', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
    navigateTo('');
  });

  describe('without a stored preference', () => {
    it('should default to the locale language', async () => {
      const commentLanguage = await loadHook();

      expect(commentLanguage.value).to.equal('en');
    });

    it('should be overridden by the url search param', async () => {
      navigateTo('?review_lang=nl');
      const commentLanguage = await loadHook();

      expect(commentLanguage.value).to.equal('nl');
    });
  });

  describe('with a stored preference', () => {
    it('should prefer the stored language over the locale', async () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'es');
      const commentLanguage = await loadHook();

      expect(commentLanguage.value).to.equal('es');
    });

    it('should prefer "all" over the locale', async () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'all');
      const commentLanguage = await loadHook();

      expect(commentLanguage.value).to.equal('all');
      expect(commentLanguage.filter).to.equal(undefined);
    });

    it('should be overridden by the url search param', async () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'es');
      navigateTo('?review_lang=nl');
      const commentLanguage = await loadHook();

      expect(commentLanguage.value).to.equal('nl');
    });

    it('should ignore a language the picker no longer offers', async () => {
      globalThis.localStorage.setItem(STORAGE_KEY, 'kl');
      const commentLanguage = await loadHook();

      expect(commentLanguage.value).to.equal('en');
    });
  });

  describe('set', () => {
    it('should persist the selection', async () => {
      const commentLanguage = await loadHook();
      commentLanguage.set('nl');

      expect(
        globalThis.localStorage.getItem(
          'trakt-client-state:comment_language:guest',
        ),
      )
        .to.equal('"nl"');
    });

    it('should keep the selection after navigating away', async () => {
      const commentLanguage = await loadHook();
      commentLanguage.set('nl');

      navigateTo('');

      expect(commentLanguage.value).to.equal('nl');
    });
  });
});
