import type { QueryClient } from '@tanstack/query-core';
import type { OnboardingSet } from '$lib/features/onboarding/models/OnboardingSet.ts';

type OnboardingAction = {
  setId: string;
  stepId: string;
};

type WatchOnboardingActivityParams = {
  client: QueryClient;
  sets: ReadonlyArray<OnboardingSet>;
  onAction: (action: OnboardingAction) => void;
};

const watched = new WeakSet<QueryClient>();

function toRoutes(sets: ReadonlyArray<OnboardingSet>) {
  return sets.flatMap((set) =>
    set.steps.flatMap(({ id, completesWith }) => {
      if (completesWith === 'always') return [];
      if ((completesWith.atLeast ?? 1) > 1) return [];
      return completesWith.mutations.map((key) => ({
        key,
        setId: set.id,
        stepId: id,
      }));
    }),
  );
}

export function watchOnboardingActivity({
  client,
  sets,
  onAction,
}: WatchOnboardingActivityParams) {
  if (watched.has(client)) return;
  watched.add(client);

  const routes = toRoutes(sets);

  client.getMutationCache().subscribe((event) => {
    if (event.type !== 'updated' || event.action.type !== 'success') return;
    if (event.action.data === 'queued') return;

    const key = event.mutation.options.mutationKey?.at(0);
    if (typeof key !== 'string') return;

    routes
      .filter((route) => route.key === key)
      .forEach(({ setId, stepId }) => onAction({ setId, stepId }));
  });
}
