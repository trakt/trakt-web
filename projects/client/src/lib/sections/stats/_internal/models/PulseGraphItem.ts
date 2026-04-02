import type { PulseGraphData, PulseGraphType } from '../pulseGraphs.ts';

export type PulseGraphItem = {
  readonly type: 'graph';
  readonly key: string;
  readonly kind: PulseGraphType;
  readonly data: PulseGraphData;
  readonly score: number;
};
