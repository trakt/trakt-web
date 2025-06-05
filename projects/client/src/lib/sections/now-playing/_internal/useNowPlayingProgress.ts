import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { derived, writable } from 'svelte/store';
import type { NowPlayingItem } from '../../../requests/models/NowPlayingItem.ts';

const UPDATE_FREQUENCY = time.seconds(1);

export function useNowPlayingProgress(nowPlaying: NowPlayingItem) {
  const now = writable(Date.now());
  const isPlaying = writable(true);

  const expiresAt = nowPlaying.expiresAt.getTime();
  const startedAt = nowPlaying.startedAt.getTime();

  onMount(() => {
    let timer: NodeJS.Timeout;

    const unsubscribe = isPlaying.subscribe((value) => {
      if (!value) {
        isPlaying.set(false);
        clearInterval(timer);
        return;
      }

      timer = setInterval(() => {
        const remaining = expiresAt - Date.now();

        now.set(Date.now());
        if (remaining <= 0) {
          isPlaying.set(false);
        }
      }, UPDATE_FREQUENCY);
    });

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  });

  return {
    remainingMinutes: derived(now, ($now) => {
      const remaining = expiresAt - $now;
      return Math.floor(remaining / 1000 / 60);
    }),
    progress: derived(now, ($now) => {
      const progress = $now - startedAt;
      const totalDuration = expiresAt - startedAt;
      return (progress / totalDuration) * 100;
    }),
    isPlaying: derived(isPlaying, ($isPlaying) => $isPlaying),
  };
}
