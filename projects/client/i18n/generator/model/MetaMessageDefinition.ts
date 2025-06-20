/**
 * Definition structure for meta messages
 */

import type { MetaMessageVariable } from './MetaMessageVariable.ts';
import type { Platform } from './Platform.ts';

export interface MetaMessageDefinition {
  default: string;
  description?: string;
  exclude?: Platform[];
  variables?: Record<string, MetaMessageVariable>;
  platforms?: {
    android?: { key?: string };
    ios?: { key?: string };
  };
}
