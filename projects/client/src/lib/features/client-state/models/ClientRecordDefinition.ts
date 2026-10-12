import type { ClientRecord } from './ClientRecord.ts';
import type { ClientStateDefinition } from './ClientStateDefinition.ts';

export type ClientRecordDefinition<E> =
  & Omit<ClientStateDefinition<ClientRecord<E>>, 'key'>
  & { kind: 'record' };
