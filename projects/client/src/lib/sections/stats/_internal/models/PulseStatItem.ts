import type { PulseStat } from './PulseStat.ts';

export type PulseStatItem = {
  readonly type: 'stat';
} & PulseStat;
