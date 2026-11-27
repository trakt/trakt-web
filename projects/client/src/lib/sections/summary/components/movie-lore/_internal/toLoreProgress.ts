import type { LoreMovie } from '$lib/requests/models/LoreMovie.ts';

type LoreProgressParams = {
  earlier: ReadonlyArray<LoreMovie>;
  watchedIds: ReadonlySet<number>;
};

type LoreStepState = 'covered' | 'next' | 'pending';

type StepStateParams = {
  isWatched: boolean;
  isNext: boolean;
};

function toStepState({ isWatched, isNext }: StepStateParams): LoreStepState {
  if (isWatched) return 'covered';

  return isNext ? 'next' : 'pending';
}

export function toLoreProgress({ earlier, watchedIds }: LoreProgressParams) {
  const next = earlier.find(({ id }) => !watchedIds.has(id)) ?? null;

  const steps = earlier.map(({ id }) => ({
    id,
    state: toStepState({
      isWatched: watchedIds.has(id),
      isNext: id === next?.id,
    }),
  }));

  return {
    steps,
    watchedCount: steps.filter(({ state }) => state === 'covered').length,
    totalCount: steps.length,
    next,
  };
}
