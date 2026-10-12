import { mergeRecords } from './_internal/mergeRecords.ts';
import { parseRecordEntries } from './_internal/parseRecordEntries.ts';
import { pruneRecord } from './_internal/pruneRecord.ts';
import { toRecordPatch } from './_internal/toRecordPatch.ts';
import type { ClientRecordDefinition } from './models/ClientRecordDefinition.ts';
import type { ClientRecordOptions } from './models/ClientRecordOptions.ts';

const preferRemote = <E>(_: E, remote: E) => remote;

export function defineClientRecord<E>({
  entry,
  mergeEntry = preferRemote,
  isExpired,
  legacyStorageKey,
  fromLegacy,
}: ClientRecordOptions<E>): ClientRecordDefinition<E> {
  return {
    kind: 'record',
    schema: parseRecordEntries(entry),
    empty: {},
    merge: (local, remote) => mergeRecords({ local, remote, mergeEntry }),
    prune:
      isExpired && ((record, now) => pruneRecord({ record, now, isExpired })),
    toPatch: toRecordPatch,
    legacyStorageKey,
    fromLegacy,
  };
}
