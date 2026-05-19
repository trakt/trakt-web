/**
 * Definition structure for meta messages
 */

import type { MetaMessageVariable } from './MetaMessageVariable.ts';

export interface MetaMessageDefinition {
  default: string;
  description?: string;
  variables?: Record<string, MetaMessageVariable>;
}
