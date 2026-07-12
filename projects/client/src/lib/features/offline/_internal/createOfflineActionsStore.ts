import { BehaviorSubject, type Observable } from 'rxjs';
import type { OfflineAction } from '../models/OfflineAction.ts';
import type { OfflineActionsStorage } from './OfflineActionsStorage.ts';

export type OfflineActionsStore = {
  actions$: Observable<OfflineAction[]>;
  current: () => OfflineAction[];
  enqueue: (action: OfflineAction) => Promise<void>;
  remove: (ids: string[]) => Promise<void>;
  refresh: () => Promise<void>;
};

function toDomain(endpoint: OfflineAction['endpoint']) {
  return endpoint.split(':').at(0);
}

// Same domain + same key set = the newer action supersedes the older one
// (e.g. mark watched then unmark while offline leaves only the unmark).
function isSuperseded(queued: OfflineAction, incoming: OfflineAction): boolean {
  return toDomain(queued.endpoint) === toDomain(incoming.endpoint) &&
    queued.keys.length === incoming.keys.length &&
    queued.keys.every((key) => incoming.keys.includes(key));
}

export function createOfflineActionsStore(
  storage: OfflineActionsStorage,
): OfflineActionsStore {
  const actions = new BehaviorSubject<OfflineAction[]>([]);

  // A rejected link would brick every later mutation, so each one settles:
  // persistence is best-effort and the in-memory queue stays authoritative.
  const settled = (task: Promise<unknown>) => task.catch(() => undefined);

  // Serializes hydration and every mutation so concurrent enqueues never
  // clobber each other's storage writes.
  let pending: Promise<unknown> = settled(
    storage.read().then((stored) => {
      actions.next([...stored, ...actions.getValue()]);
    }),
  );

  const mutate = (updater: (current: OfflineAction[]) => OfflineAction[]) => {
    pending = settled(
      pending.then(() => {
        const next = updater(actions.getValue());
        actions.next(next);
        return storage.write(next);
      }),
    );
    return pending.then(() => undefined);
  };

  return {
    actions$: actions.asObservable(),
    current: () => actions.getValue(),
    enqueue: (action) =>
      mutate((current) => [
        ...current.filter((queued) => !isSuperseded(queued, action)),
        action,
      ]),
    remove: (ids) =>
      mutate((current) => current.filter((queued) => !ids.includes(queued.id))),
    refresh: () => {
      pending = settled(
        pending.then(async () => {
          actions.next(await storage.read());
        }),
      );
      return pending.then(() => undefined);
    },
  };
}
