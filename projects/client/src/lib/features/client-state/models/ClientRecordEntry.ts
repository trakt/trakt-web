import type { z } from 'zod';
import type { clientStateDefinitions } from '../clientStateDefinitions.ts';
import type { ClientRecordKey } from './ClientRecordKey.ts';

export type ClientRecordEntry<K extends ClientRecordKey> = z.output<
  typeof clientStateDefinitions[K]['schema']
>[string];
