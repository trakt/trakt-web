import { renderStore } from '$test/beds/store/renderStore.ts';
import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useTodaySeenStories } from './useTodaySeenStories.ts';

describe('store: useTodaySeenStories', () => {
  it('should remember when a story was seen', async () => {
    const { seenStories, markSeen } = await renderStore(() =>
      useTodaySeenStories()
    );

    markSeen('movie-1');

    const seen = await firstValueFrom(seenStories);
    expect(seen['movie-1']).toBeTypeOf('number');
    expect(seen['movie-2']).toBeUndefined();
  });

  it('should share seen stories between instances', async () => {
    const [first, second] = await renderStore(() => [
      useTodaySeenStories(),
      useTodaySeenStories(),
    ]);

    first.markSeen('show-3');

    const seen = await firstValueFrom(second.seenStories);
    expect(seen['show-3']).toBeTypeOf('number');
  });

  it('should forget stories seen outside the today window', async () => {
    localStorage.clear();
    localStorage.setItem(
      'today-seen-stories',
      JSON.stringify({ 'show-5': 1, 'show-6': Date.now() }),
    );

    const { seenStories } = await renderStore(() => useTodaySeenStories());

    const seen = await firstValueFrom(seenStories);
    expect(seen['show-5']).toBeUndefined();
    expect(seen['show-6']).toBeTypeOf('number');
  });
});
