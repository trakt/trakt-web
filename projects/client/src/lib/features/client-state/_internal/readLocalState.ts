import type { ClientStateDefinition } from '../models/ClientStateDefinition.ts';
import type { UserId } from '../models/UserId.ts';
import { parseJson } from './parseJson.ts';
import { toLocalStorageKey } from './toLocalStorageKey.ts';

type ReadLocalStateProps<T> = {
  definition: ClientStateDefinition<T>;
  storage: Pick<Storage, 'getItem'>;
  userId: UserId;
};

function parseValue<T>(
  { schema }: ClientStateDefinition<T>,
  value: unknown,
): T | null {
  const parsed = schema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function readLegacyState<T>(
  { definition, storage, userId }: ReadLocalStateProps<T>,
): T | null {
  if (!definition.legacyStorageKey) return null;

  const raw = storage.getItem(definition.legacyStorageKey);
  if (raw == null) return null;

  const legacy = parseJson(raw) ?? raw;

  const migrated = definition.fromLegacy
    ? definition.fromLegacy(legacy, userId)
    : legacy;

  return parseValue(definition, migrated);
}

export function readLocalState<T>(props: ReadLocalStateProps<T>): T {
  const { definition, storage, userId } = props;
  const stored = parseJson(
    storage.getItem(
      toLocalStorageKey({ key: definition.key, userId }),
    ),
  );

  if (stored !== undefined) {
    return parseValue(definition, stored) ?? definition.empty;
  }

  return readLegacyState(props) ?? definition.empty;
}
