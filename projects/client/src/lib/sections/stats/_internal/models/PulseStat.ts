import type { PulseDeltaKind } from '$lib/sections/stats/_internal/models/PulseDeltaKind.ts';

export type PulseStat = {
  readonly key: string;
  readonly rawValue: number;
  readonly value: string;
  readonly label: string;
  readonly tooltip: string;
  readonly delta: number;
  readonly deltaKind: PulseDeltaKind;
};
