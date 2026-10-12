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

export type SaveClientState = (params: {
  key: string;
  value: unknown;
  method: 'PUT' | 'PATCH';
}) => Promise<unknown>;

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

type RemoteState<T> =
  | { status: 'missing' }
  | { status: 'unreadable' }
  | { status: 'readable'; value: T };

export function createClientStateStore<T>({
  definition,
  userId,
  remote,
  save,
  storage,
}: CreateClientStateStoreProps<T>) {
  const { key, schema, empty, merge } = definition;
  const prune = (next: T) => definition.prune?.(next, Date.now()) ?? next;
  const value = new BehaviorSubject<T>(empty);
  const session = new BehaviorSubject<Session>({ userId: 0, isSynced: false });
  const uploads = new Subject<PendingUpload<T>>();
  let isLoaded = false;
  let hasUnsavedChanges = false;
  let serverValue: T = empty;

  const commit = ($userId: UserId, next: T) => {
    storage.setItem(
      toLocalStorageKey({ key, userId: $userId }),
      JSON.stringify(next),
    );
    value.next(next);
  };

  const parseRemote = ($remote: ClientState): RemoteState<T> => {
    const raw = $remote[String(key)];
    if (raw === undefined) return { status: 'missing' };

    const parsed = schema.safeParse(raw);
    return parsed.success
      ? { status: 'readable', value: parsed.data }
      : { status: 'unreadable' };
  };

  const toSaveRequest = (next: T) => {
    if (!definition.toPatch) {
      return { key: String(key), value: next, method: 'PUT' as const };
    }

    const patch = definition.toPatch(serverValue, next);
    if (Object.keys(patch).length === 0) return null;

    return { key: String(key), value: patch, method: 'PATCH' as const };
  };

  if (browser) {
    uploads
      .pipe(
        debounceTime(UPLOAD_DEBOUNCE),
        filter((upload) => upload.userId === session.value.userId),
      )
      .subscribe((upload) => {
        const request = toSaveRequest(upload.value);
        if (!request) return;

        hasUnsavedChanges = true;
        save(request)
          .then((isSaved) => {
            if (isSaved === false) return;
            hasUnsavedChanges = false;
            serverValue = upload.value;
          })
          .catch(NOOP_FN);
      });

    remote
      .pipe(filter(() => hasUnsavedChanges && session.value.isSynced))
      .subscribe(() => {
        uploads.next({ userId: session.value.userId, value: value.value });
      });

    userId.pipe(distinctUntilChanged()).subscribe(($userId) => {
      session.next({ userId: $userId, isSynced: false });
      serverValue = empty;
      isLoaded = true;
      value.next(
        prune(readLocalState({ definition, storage, userId: $userId })),
      );
    });

    combineLatest([userId, remote])
      .pipe(
        filter(
          (pair): pair is [UserId, ClientState] =>
            pair[0] !== 0 && pair[1] != null,
        ),
        map(([$userId, $remote]) => ({
          userId: $userId,
          remote: parseRemote($remote),
        })),
        distinctUntilChanged((a, b) => isSameState(a, b)),
      )
      .subscribe(({ userId: $userId, remote: $remote }) => {
        if ($remote.status === 'unreadable') return;

        serverValue = $remote.status === 'readable' ? $remote.value : empty;
        const pruned = prune(serverValue);
        const reconciled = reconcileClientState({
          local: value.value,
          remote: $remote.status === 'readable' ? pruned : null,
          empty,
          merge,
        });

        commit($userId, reconciled.value);
        session.next({ userId: $userId, isSynced: true });

        if (reconciled.shouldUpload || !isSameState(pruned, serverValue)) {
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
