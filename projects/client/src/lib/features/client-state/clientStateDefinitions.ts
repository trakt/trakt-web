import { ClientStateKey } from './models/ClientStateKey.ts';

export const clientStateDefinitions = {} satisfies Record<
  ClientStateKey,
  { kind: 'record' | 'value' }
>;
