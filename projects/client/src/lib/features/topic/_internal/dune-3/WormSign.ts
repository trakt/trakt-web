import type { WormStage } from './WormStage.ts';

type WormReading = {
  level: number;
  wormAt: number;
  stage: WormStage;
};

export type WormSign = {
  read: (now: number) => WormReading;
  start: () => void;
  stop: () => void;
};
