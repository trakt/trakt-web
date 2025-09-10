import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { derived } from 'svelte/store';
import { getToastContext } from './_internal/getToastContext.ts';

const UPDATE_FREQUENCY = time.seconds(1);

export function useNowPlaying() {
  const { nowPlaying, progress, remainingMinutes } = getToastContext();

  onMount(() => {
    let timer: NodeJS.Timeout;

    const unsubscribe = nowPlaying.subscribe((value) => {
      clearInterval(timer);

      if (!value) {
        progress.set(0);
        remainingMinutes.set(0);
        return;
      }

      const expiresAt = value.expiresAt.getTime();
      const startedAt = value.startedAt.getTime();

      const updateProgress = () => {
        const now = Date.now();

        const remaining = expiresAt - now;
        const difference = now - startedAt;
        const totalDuration = expiresAt - startedAt;

        const progressPercentage = (difference / totalDuration) * 100;

        remainingMinutes.set(Math.max(remaining / time.minutes(1), 1));
        progress.set(progressPercentage);

        if (progressPercentage >= 100) {
          nowPlaying.set(null);
        }
      };

      updateProgress();
      timer = setInterval(updateProgress, UPDATE_FREQUENCY);
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  });

  return {
    nowPlaying,
    progress: derived(progress, ($progress) => $progress),
    remainingMinutes: derived(
      remainingMinutes,
      ($remainingMinutes) => $remainingMinutes,
    ),
  };
}
