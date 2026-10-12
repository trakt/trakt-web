import type { ClientStateDefinition } from './ClientStateDefinition.ts';

export type ClientValueDefinition<T> =
  & Omit<ClientStateDefinition<T | null>, 'key'>
  & { kind: 'value' };
