import type { z } from 'zod';
import type { clientStateDefinitions } from '../clientStateDefinitions.ts';
import type { ClientValueKey } from './ClientValueKey.ts';

export type ClientValue<K extends ClientValueKey> = NonNullable<
  z.output<typeof clientStateDefinitions[K]['schema']>
>;
