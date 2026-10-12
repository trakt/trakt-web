import { z } from 'zod';
import { mergeRecords } from './_internal/mergeRecords.ts';
import { pruneRecord } from './_internal/pruneRecord.ts';
import type { ClientRecord } from './models/ClientRecord.ts';
import type { ClientRecordDefinition } from './models/ClientRecordDefinition.ts';
import type { ClientRecordOptions } from './models/ClientRecordOptions.ts';

const preferRemote = <E>(_: E, remote: E) => remote;

export function defineClientRecord<E>(
  {
    entry,
    mergeEntry = preferRemote,
    isExpired,
    legacyStorageKey,
    fromLegacy,
  }: ClientRecordOptions<E>,
): ClientRecordDefinition<E> {
  return {
    kind: 'record',
    schema: z.record(z.string(), entry) as z.ZodType<ClientRecord<E>>,
    empty: {},
    merge: (local, remote) => mergeRecords({ local, remote, mergeEntry }),
    prune: isExpired &&
      ((record, now) => pruneRecord({ record, now, isExpired })),
    legacyStorageKey,
    fromLegacy,
  };
}
