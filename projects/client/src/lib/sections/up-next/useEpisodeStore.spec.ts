import { useEpisodeStore } from '$lib/sections/up-next/useEpisodeStore.ts';
import { get } from 'svelte/store';
import { describe, expect, it } from 'vitest';
import type { EpisodeEntry } from '../../requests/queries/calendars/upcomingEpisodesQuery.ts';

const episode1 = {
  show: {
    id: 1,
    title: 'Show 1',
  },
};

const episode2 = {
  show: {
    id: 2,
    title: 'Show 2',
  },
};

const episode3 = {
  show: {
    id: 3,
    title: 'Show 3',
  },
};

describe('useEpisodeStore', () => {
  it('should return a store with an empty array', () => {
    expect(get(useEpisodeStore().value)).toEqual([]);
  });

  it('should update the store with a new episode', () => {
    const store = useEpisodeStore();

    store.set([episode1] as unknown as EpisodeEntry[]);

    expect(get(store.value)).toEqual([episode1]);
  });

  it('should update the store with multiple episodes', () => {
    const store = useEpisodeStore();
    const episodes: Partial<EpisodeEntry>[] = [episode1, episode2];

    store.set(episodes as unknown as EpisodeEntry[]);

    expect(get(store.value)).toEqual(episodes);
  });

  it('should update the store with the same episode', () => {
    const store = useEpisodeStore();

    store.set([episode1] as unknown as EpisodeEntry[]);
    store.set([episode1] as unknown as EpisodeEntry[]);

    expect(get(store.value)).toEqual([episode1]);
  });

  it('should update the store with the same episode with different data', () => {
    const store = useEpisodeStore();

    const update = { ...episode1, title: 'Updated Show 1' };
    store.set([episode1] as unknown as EpisodeEntry[]);
    store.set([update] as unknown as EpisodeEntry[]);

    expect(get(store.value)).toEqual([update]);
  });

  it('should update the store with multiple episodes with the same episode', () => {
    const store = useEpisodeStore();
    const episodes: Partial<EpisodeEntry>[] = [
      episode1,
      episode1,
    ];

    store.set(episodes as unknown as EpisodeEntry[]);

    expect(get(store.value)).toEqual([episode1]);
  });

  it('should add new episodes at the end of the list', () => {
    const store = useEpisodeStore();

    store.set([episode1, episode2] as unknown as EpisodeEntry[]);
    store.set([episode3, episode1, episode2] as unknown as EpisodeEntry[]);

    expect(get(store.value)).toEqual([episode1, episode2, episode3]);
  });

  it('should remove episodes that are not in the new list', () => {
    const store = useEpisodeStore();

    store.set([episode1, episode2] as unknown as EpisodeEntry[]);
    store.set([episode3] as unknown as EpisodeEntry[]);

    expect(get(store.value)).toEqual([episode3]);
  });

  it('should keep the order of the episodes', () => {
    const store = useEpisodeStore();
    const update2 = { ...episode2, title: 'Updated Show 2' };

    store.set([episode1, episode2, episode3] as unknown as EpisodeEntry[]);
    store.set([update2, episode1, episode3] as unknown as EpisodeEntry[]);

    expect(get(store.value)).toEqual([episode1, update2, episode3]);
  });
});
