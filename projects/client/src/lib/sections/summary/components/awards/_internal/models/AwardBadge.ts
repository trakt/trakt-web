import type { AwardTally } from './AwardTally.ts';

export type AwardBadge = AwardTally & {
  isLive: boolean;
};
