import type { AwardEntry } from '$lib/requests/models/AwardEntry.ts';

export type AwardTimelineTick = {
  key: string;
  year: number;
  x: number;
  isNow: boolean;
};

export type AwardTimelinePoint = {
  entry: AwardEntry;
  x: number;
};

export type AwardTimelineYear = {
  key: string;
  year: number;
  x: number;
  isWon: boolean;
  entries: ReadonlyArray<AwardEntry>;
};

export type AwardTimelineMilestone = AwardTimelinePoint & {
  align: 'start' | 'middle' | 'end';
  isBelow: boolean;
};

export type AwardTimelineWinLabel = {
  key: string;
  year: number;
  x: number;
  isLow: boolean;
};

export type AwardTimeline = {
  start: number;
  ticks: ReadonlyArray<AwardTimelineTick>;
  years: ReadonlyArray<AwardTimelineYear>;
  milestones: ReadonlyArray<AwardTimelineMilestone>;
  winLabels: ReadonlyArray<AwardTimelineWinLabel>;
};
