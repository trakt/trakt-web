import { distinctUntilChanged, map } from 'rxjs';
import type { ClientRecord } from './models/ClientRecord.ts';
import type { ClientRecordEntry } from './models/ClientRecordEntry.ts';
import type { ClientRecordKey } from './models/ClientRecordKey.ts';
import { useClientState } from './useClientState.ts';

export function useClientRecord<K extends ClientRecordKey>(key: K) {
  type E = ClientRecordEntry<K>;
  const store = useClientState<ClientRecord<E>>(key);

  return {
    entries: store.value,
    entry: (id: string) =>
      store.value.pipe(
        map((record): E | undefined => record[id]),
        distinctUntilChanged(),
      ),
    current: (id: string): E | undefined => store.current()[id],
    set: (id: string, entry: E) =>
      store.update((record) => ({ ...record, [id]: entry })),
    update: (id: string, change: (entry: E | undefined) => E) =>
      store.update((record) => ({ ...record, [id]: change(record[id]) })),
    remove: (id: string) =>
      store.update((record) =>
        Object.fromEntries(
          Object.entries(record).filter(([entryId]) => entryId !== id),
        )
      ),
  };
}
