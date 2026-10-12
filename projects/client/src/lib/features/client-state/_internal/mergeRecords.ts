import type { ClientRecord } from '../models/ClientRecord.ts';

type MergeRecordsProps<E> = {
  local: ClientRecord<E>;
  remote: ClientRecord<E>;
  mergeEntry: (local: E, remote: E) => E;
};

export function mergeRecords<E>(
  { local, remote, mergeEntry }: MergeRecordsProps<E>,
): ClientRecord<E> {
  return Object.entries(local).reduce<ClientRecord<E>>(
    (merged, [id, entry]) => {
      const other = merged[id];
      return {
        ...merged,
        [id]: other === undefined ? entry : mergeEntry(entry, other),
      };
    },
    remote,
  );
}
