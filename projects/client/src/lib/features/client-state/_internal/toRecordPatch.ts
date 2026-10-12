import type { ClientRecord } from '../models/ClientRecord.ts';
import { isSameState } from './isSameState.ts';

export function toRecordPatch<E>(
  base: ClientRecord<E>,
  next: ClientRecord<E>,
): Record<string, E | null> {
  const changed = Object.entries(next).filter(
    ([id, entry]) => !isSameState(base[id], entry),
  );
  const removed = Object.keys(base)
    .filter((id) => !(id in next))
    .map((id) => [id, null]);

  return Object.fromEntries([...changed, ...removed]);
}
