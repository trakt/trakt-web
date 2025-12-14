import { time } from '$lib/utils/timing/time.ts';
import { onMount } from 'svelte';
import { getToastContext } from './_internal/getToastContext.ts';

const UPDATE_FREQUENCY = time.seconds(1);

export function useNowPlaying() {
  const { nowPlaying, progress, remainingMinutes } = getToastContext();

  onMount(() => {
    let timer: ReturnType<typeof setInterval>;

    const subscription = nowPlaying.subscribe((value) => {
      clearInterval(timer);

      if (!value) {
        progress.next(0);
        remainingMinutes.next(0);
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

        remainingMinutes.next(Math.max(remaining / time.minutes(1), 1));
        progress.next(progressPercentage);

        if (progressPercentage >= 100) {
          nowPlaying.next(null);
        }
      };

      updateProgress();
      timer = setInterval(updateProgress, UPDATE_FREQUENCY);
    });

    return () => {
      clearInterval(timer);
      subscription.unsubscribe();
    };
  });

  return {
    nowPlaying,
    progress,
    remainingMinutes,
  };
}
