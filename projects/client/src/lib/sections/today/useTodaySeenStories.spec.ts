import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';
import { useTodaySeenStories } from './useTodaySeenStories.ts';

describe('store: useTodaySeenStories', () => {
  it('should remember when a story was seen', async () => {
    const { seenStories, markSeen } = useTodaySeenStories();

    markSeen('movie-1');

    const seen = await firstValueFrom(seenStories);
    expect(seen['movie-1']).toBeTypeOf('number');
    expect(seen['movie-2']).toBeUndefined();
  });

  it('should share seen stories between instances', async () => {
    useTodaySeenStories().markSeen('show-3');

    const seen = await firstValueFrom(useTodaySeenStories().seenStories);

    expect(seen['show-3']).toBeTypeOf('number');
  });

  it('should persist seen stories', () => {
    useTodaySeenStories().markSeen('show-4');

    const stored = JSON.parse(
      localStorage.getItem('today-seen-stories') ?? '{}',
    );

    expect(stored['show-4']).toBeTypeOf('number');
  });
});
