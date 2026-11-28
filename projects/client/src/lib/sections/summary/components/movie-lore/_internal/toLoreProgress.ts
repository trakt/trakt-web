import type { LoreMovie } from '$lib/requests/models/LoreMovie.ts';

type LoreProgressParams = {
  earlier: ReadonlyArray<LoreMovie>;
  mustWatchIds: ReadonlySet<number>;
  watchedIds: ReadonlySet<number>;
};

type LoreStep = {
  id: number;
  isSeen: boolean;
};

function toGroup(
  films: ReadonlyArray<LoreMovie>,
  watchedIds: ReadonlySet<number>,
) {
  const steps: ReadonlyArray<LoreStep> = films.map(({ id }) => ({
    id,
    isSeen: watchedIds.has(id),
  }));

  return {
    steps,
    seenCount: steps.filter(({ isSeen }) => isSeen).length,
    totalCount: steps.length,
  };
}

export function toLoreProgress({
  earlier,
  mustWatchIds,
  watchedIds,
}: LoreProgressParams) {
  const mustWatch = earlier.filter(({ id }) => mustWatchIds.has(id));
  const optional = earlier.filter(({ id }) => !mustWatchIds.has(id));

  return {
    mustWatch: toGroup(mustWatch, watchedIds),
    optional: toGroup(optional, watchedIds),
    unseenMustWatch: mustWatch.filter(({ id }) => !watchedIds.has(id)),
  };
}
