import type { clientStateDefinitions } from '../clientStateDefinitions.ts';

type Definitions = typeof clientStateDefinitions;

export type ClientRecordKey = {
  [K in keyof Definitions]: Definitions[K] extends { kind: 'record' } ? K
    : never;
}[keyof Definitions];
