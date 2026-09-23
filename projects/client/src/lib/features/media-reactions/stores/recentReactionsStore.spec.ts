import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactionSentiment } from '$lib/requests/models/ReactionSentiment.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';

const STORAGE_KEY = 'trakt-recent-reactions';

async function importStore() {
  /* The subject seeds from storage at module load, so each case needs a fresh
     module rather than a shared one. */
  vi.resetModules();
  const { recentReactionsStore } = await import('./recentReactionsStore.ts');
  return recentReactionsStore;
}

function currentRecent(
  store: Awaited<ReturnType<typeof importStore>>,
): string[] {
  let value: string[] = [];
  store.recent.subscribe((entries: string[]) => (value = entries))
    .unsubscribe();
  return value;
}

describe('store: recentReactionsStore', () => {
  beforeEach(() => safeLocalStorage.removeItem(STORAGE_KEY));

  it('should start empty when nothing was stored', async () => {
    const store = await importStore();

    expect(currentRecent(store)).toEqual([]);
  });

  it('should seed from what a previous visit stored', async () => {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(['love', 'bored']));

    const store = await importStore();

    expect(currentRecent(store)).toEqual(['love', 'bored']);
  });

  it('should ignore stored junk rather than break the picker', async () => {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(['not-a-sentiment']));

    const store = await importStore();

    expect(currentRecent(store)).toEqual([]);
  });

  it('should put the newest pick first', async () => {
    const store = await importStore();

    store.remember('love');
    store.remember('bored');

    expect(currentRecent(store)).toEqual(['bored', 'love']);
  });

  it('should move a repeated pick to the front rather than duplicate it', async () => {
    const store = await importStore();

    store.remember('love');
    store.remember('bored');
    store.remember('love');

    expect(currentRecent(store)).toEqual(['love', 'bored']);
  });

  it('should keep at most four', async () => {
    const store = await importStore();

    const picks: ReactionSentiment[] = [
      'love',
      'bored',
      'cringe',
      'shook',
      'vomit',
    ];

    for (const sentiment of picks) {
      store.remember(sentiment);
    }

    expect(currentRecent(store)).toEqual(['vomit', 'shook', 'cringe', 'bored']);
  });
});
