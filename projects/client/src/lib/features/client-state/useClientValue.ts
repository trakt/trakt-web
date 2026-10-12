import type { ClientValue } from './models/ClientValue.ts';
import type { ClientValueKey } from './models/ClientValueKey.ts';
import { useClientState } from './useClientState.ts';

export function useClientValue<K extends ClientValueKey>(key: K) {
  const store = useClientState<ClientValue<K> | null>(key);

  return {
    value: store.value,
    set: (next: ClientValue<K>) => store.update(() => next),
  };
}
