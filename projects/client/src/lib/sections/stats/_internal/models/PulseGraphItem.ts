import type { PulseGraphData } from './PulseGraphData.ts';
import type { PulseGraphType } from './PulseGraphType.ts';

export type PulseGraphItem = {
  readonly type: 'graph';
  readonly key: string;
  readonly kind: PulseGraphType;
  readonly data: PulseGraphData;
  readonly score: number;
};
