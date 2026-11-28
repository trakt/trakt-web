import { prefersReducedMotion } from './prefersReducedMotion.ts';

type StingerPhase = 'idle' | 'playing' | 'leaving';

type UseStingerParams = {
  seenKey: string;
  holdFor: number;
  calmHoldFor?: number;
  exitFor: number;
};

const readSeen = (seenKey: string) => {
  try {
    return sessionStorage.getItem(seenKey) !== null;
  } catch {
    return true;
  }
};

const markSeen = (seenKey: string) => {
  try {
    sessionStorage.setItem(seenKey, '1');
  } catch {
    return;
  }
};

export function useStinger({
  seenKey,
  holdFor,
  calmHoldFor = holdFor,
  exitFor,
}: UseStingerParams) {
  const calm = prefersReducedMotion();
  const state = $state<{ phase: StingerPhase }>({
    phase: readSeen(seenKey) ? 'idle' : 'playing',
  });
  const timing = { leftAt: null as number | null };

  const leave = () => {
    if (state.phase !== 'playing') return;
    timing.leftAt = performance.now();
    state.phase = 'leaving';
  };

  $effect(() => {
    if (state.phase === 'idle') return;
    if (state.phase === 'leaving') {
      const timer = setTimeout(() => (state.phase = 'idle'), exitFor);
      return () => clearTimeout(timer);
    }

    markSeen(seenKey);
    const timer = setTimeout(leave, calm ? calmHoldFor : holdFor);
    const options = { once: true, passive: true } as const;
    const events = ['keydown', 'pointerdown', 'wheel', 'touchstart'] as const;
    events.forEach((name) => window.addEventListener(name, leave, options));

    return () => {
      clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, leave));
    };
  });

  return {
    calm,
    leave,
    leftAt: () => timing.leftAt,
    get phase() {
      return state.phase;
    },
  };
}
