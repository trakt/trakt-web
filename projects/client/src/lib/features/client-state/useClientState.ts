import { useClientStateRegistry } from './_internal/useClientStateRegistry.ts';
import { clientStateDefinitions } from './clientStateDefinitions.ts';
import type { ClientStateDefinition } from './models/ClientStateDefinition.ts';
import type { ClientStateKey } from './models/ClientStateKey.ts';

const definitions: Readonly<Record<ClientStateKey, object>> =
  clientStateDefinitions;

export function useClientState<T>(key: ClientStateKey) {
  const definition = {
    ...definitions[key],
    key,
  } as unknown as ClientStateDefinition<T>;

  return useClientStateRegistry()(definition);
}
