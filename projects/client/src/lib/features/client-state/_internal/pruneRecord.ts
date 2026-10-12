import type { ClientRecord } from '../models/ClientRecord.ts';

type PruneRecordProps<E> = {
  record: ClientRecord<E>;
  now: number;
  isExpired: (entry: E, now: number) => boolean;
};

export function pruneRecord<E>(
  { record, now, isExpired }: PruneRecordProps<E>,
): ClientRecord<E> {
  return Object.fromEntries(
    Object.entries(record).filter(([, entry]) => !isExpired(entry, now)),
  );
}
