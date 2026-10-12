import { browser } from '$app/environment';
import type { ClientState } from '$lib/requests/models/ClientState.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { time } from '$lib/utils/timing/time.ts';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  type Observable,
  Subject,
} from 'rxjs';
import type { ClientStateDefinition } from '../models/ClientStateDefinition.ts';
import type { UserId } from '../models/UserId.ts';
import { isSameState } from './isSameState.ts';
import { readLocalState } from './readLocalState.ts';
import { reconcileClientState } from './reconcileClientState.ts';
import { toLocalStorageKey } from './toLocalStorageKey.ts';

const UPLOAD_DEBOUNCE = time.seconds(1);

export type SaveClientState = (
  params: { key: string; value: unknown },
) => Promise<unknown>;

type CreateClientStateStoreProps<T> = {
  definition: ClientStateDefinition<T>;
  userId: Observable<UserId>;
  remote: Observable<ClientState | Nil>;
  save: SaveClientState;
  storage: Storage;
};

type Session = {
  userId: UserId;
  isSynced: boolean;
};

type PendingUpload<T> = {
  userId: UserId;
  value: T;
};

export function createClientStateStore<T>(
  { definition, userId, remote, save, storage }: CreateClientStateStoreProps<
    T
  >,
) {
  const { key, schema, empty, merge } = definition;
  const prune = (next: T) => definition.prune?.(next, Date.now()) ?? next;
  const value = new BehaviorSubject<T>(empty);
  const session = new BehaviorSubject<Session>({ userId: 0, isSynced: false });
  const uploads = new Subject<PendingUpload<T>>();
  let isLoaded = false;
  let hasUnsavedChanges = false;

  const commit = ($userId: UserId, next: T) => {
    storage.setItem(
      toLocalStorageKey({ key, userId: $userId }),
      JSON.stringify(next),
    );
    value.next(next);
  };

  const parseRemote = ($remote: ClientState): T | null => {
    const parsed = schema.safeParse($remote[String(key)]);
    return parsed.success ? prune(parsed.data) : null;
  };

  if (browser) {
    uploads.pipe(
      debounceTime(UPLOAD_DEBOUNCE),
      filter((upload) => upload.userId === session.value.userId),
    ).subscribe((upload) => {
      hasUnsavedChanges = true;
      save({ key: String(key), value: upload.value })
        .then((isSaved) => {
          if (isSaved !== false) hasUnsavedChanges = false;
        })
        .catch(NOOP_FN);
    });

    remote.pipe(
      filter(() => hasUnsavedChanges && session.value.isSynced),
    ).subscribe(() => {
      uploads.next({ userId: session.value.userId, value: value.value });
    });

    userId.pipe(distinctUntilChanged()).subscribe(($userId) => {
      session.next({ userId: $userId, isSynced: false });
      isLoaded = true;
      value.next(
        prune(readLocalState({ definition, storage, userId: $userId })),
      );
    });

    combineLatest([userId, remote]).pipe(
      filter((pair): pair is [UserId, ClientState] =>
        pair[0] !== 0 && pair[1] != null
      ),
      map(([$userId, $remote]) => ({
        userId: $userId,
        remote: parseRemote($remote),
      })),
      distinctUntilChanged((a, b) => isSameState(a, b)),
    ).subscribe(({ userId: $userId, remote: $remote }) => {
      const reconciled = reconcileClientState({
        local: value.value,
        remote: $remote,
        empty,
        merge,
      });

      commit($userId, reconciled.value);
      session.next({ userId: $userId, isSynced: true });

      if (reconciled.shouldUpload) {
        uploads.next({ userId: $userId, value: reconciled.value });
      }
    });
  }

  const update = (change: (current: T) => T) => {
    const next = prune(change(value.value));
    const { userId: $userId, isSynced } = session.value;

    commit($userId, next);

    if ($userId !== 0 && isSynced) {
      uploads.next({ userId: $userId, value: next });
    }
  };

  return {
    value: value.pipe(filter(() => isLoaded)),
    current: () => value.value,
    update,
  };
}
