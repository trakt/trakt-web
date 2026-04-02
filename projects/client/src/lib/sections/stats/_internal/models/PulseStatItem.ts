import type { PulseStat } from './PulseStat.ts';

export type PulseStatItem = {
  readonly type: 'stat';
  readonly key: string;
  readonly score: number;
} & PulseStat;
