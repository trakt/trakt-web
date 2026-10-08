import type { MediaReaction } from '$lib/requests/models/MediaReaction.ts';
import { applyPendingReactions } from './applyPendingReactions.ts';
import type { PendingReactions } from './PendingReactions.ts';
import type { ReactionsSnapshot } from './ReactionsSnapshot.ts';

type UseOptimisticReactionsParams = {
  live: () => ReactionsSnapshot;
  idsOf: (reaction: MediaReaction) => ReadonlyArray<number>;
  react: (reaction: MediaReaction) => Promise<boolean>;
  remove: (ids: ReadonlyArray<number>) => Promise<boolean>;
  limit: number;
};

export function useOptimisticReactions(
  { live, idsOf, react, remove, limit }: UseOptimisticReactionsParams,
) {
  let snapshot = $state<ReactionsSnapshot | null>(null);
  let pending = $state<PendingReactions>({});
  let inFlight = $state(0);

  const merged = $derived(
    applyPendingReactions(
      inFlight > 0 && snapshot
        ? { ...snapshot, pending }
        : { ...live(), pending: {} },
    ),
  );

  function track(reaction: MediaReaction, request: Promise<boolean>) {
    const revert = () => {
      const { [reaction]: _, ...rest } = pending;
      pending = rest;
    };

    request
      .then((isOk) => !isOk && revert())
      .catch(revert)
      .finally(() => {
        const entry = pending[reaction];
        if (entry) {
          pending = { ...pending, [reaction]: { ...entry, isSettled: true } };
        }
        inFlight -= 1;
      });
  }

  function begin(reaction: MediaReaction, isPresent: boolean) {
    if (inFlight === 0) {
      snapshot = live();
      pending = {};
    }

    inFlight += 1;
    pending = { ...pending, [reaction]: { isPresent, isSettled: false } };
  }

  function removeReaction(reaction: MediaReaction) {
    const ids = idsOf(reaction);
    if (ids.length === 0) return false;

    begin(reaction, false);
    track(reaction, remove(ids));
    return true;
  }

  function addReaction(reaction: MediaReaction) {
    if (merged.chosen.length >= limit) return false;

    begin(reaction, true);
    track(reaction, react(reaction));
    return true;
  }

  function select(reaction: MediaReaction) {
    if (merged.locked.includes(reaction)) return false;

    return merged.chosen.includes(reaction)
      ? removeReaction(reaction)
      : addReaction(reaction);
  }

  return {
    get merged() {
      return merged;
    },
    select,
  };
}
