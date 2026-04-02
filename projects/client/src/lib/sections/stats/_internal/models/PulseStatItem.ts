import type { PulseStat } from '../pulseStats.ts';

export type PulseStatItem = {
  readonly type: 'stat';
  readonly key: string;
  readonly score: number;
} & PulseStat;
