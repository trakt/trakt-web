import { useUser } from '$lib/features/auth/stores/useUser.ts';
import { defineMutation } from '$lib/features/query/defineMutation.ts';
import { useMutation } from '$lib/features/query/useMutation.ts';
import { saveClientStateRequest } from '$lib/requests/queries/users/saveClientStateRequest.ts';
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';
import { map } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type { ClientStateDefinition } from '../models/ClientStateDefinition.ts';
import { createClientStateStore } from './createClientStateStore.ts';

const CLIENT_STATE_CONTEXT_KEY = Symbol('client-state');

type ClientStateStore<T> = ReturnType<typeof createClientStateStore<T>>;

function createClientStateRegistry() {
  const { user, clientState } = useUser();
  const { mutate } = useMutation(defineMutation({
    key: 'client-state:save',
    request: saveClientStateRequest,
    invalidations: [],
  }));
  const userId = user.pipe(map(($user) => $user?.id ?? 0));
  const stores = new Map<string, ClientStateStore<unknown>>();

  return <T>(definition: ClientStateDefinition<T>): ClientStateStore<T> => {
    const existing = stores.get(String(definition.key));
    if (existing) return existing as ClientStateStore<T>;

    const store = createClientStateStore({
      definition,
      userId,
      remote: clientState,
      save: mutate,
      storage: safeLocalStorage,
    });
    stores.set(String(definition.key), store as ClientStateStore<unknown>);
    return store;
  };
}

type ClientStateRegistry = ReturnType<typeof createClientStateRegistry>;

export function useClientStateRegistry(): ClientStateRegistry {
  const existing = getContext<ClientStateRegistry | undefined>(
    CLIENT_STATE_CONTEXT_KEY,
  );
  if (existing) return existing;

  const registry = createClientStateRegistry();
  setContext(CLIENT_STATE_CONTEXT_KEY, registry);
  return registry;
}
