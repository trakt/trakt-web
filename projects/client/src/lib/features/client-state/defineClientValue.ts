import type { ClientValueDefinition } from './models/ClientValueDefinition.ts';
import type { ClientValueOptions } from './models/ClientValueOptions.ts';

export function defineClientValue<T>(
  { schema, legacyStorageKey, fromLegacy }: ClientValueOptions<T>,
): ClientValueDefinition<T> {
  return {
    kind: 'value',
    schema: schema.nullable(),
    empty: null,
    merge: (local, remote) => remote ?? local,
    legacyStorageKey,
    fromLegacy,
  };
}
