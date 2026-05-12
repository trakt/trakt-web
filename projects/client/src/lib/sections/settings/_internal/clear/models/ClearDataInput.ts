import type { ClearDataInputMap } from './ClearDataInputMap.ts';
import type { ClearSourceType } from './ClearSourceType.ts';

export type ClearDataInput = {
  [K in ClearSourceType]: { type: K; input: ClearDataInputMap[K] };
}[ClearSourceType];
