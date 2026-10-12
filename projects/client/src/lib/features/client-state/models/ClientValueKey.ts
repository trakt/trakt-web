import type { clientStateDefinitions } from '../clientStateDefinitions.ts';

type Definitions = typeof clientStateDefinitions;

export type ClientValueKey = {
  [K in keyof Definitions]: Definitions[K] extends { kind: 'value' } ? K
    : never;
}[keyof Definitions];
