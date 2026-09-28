import type { TodayStoryGroup } from '../models/TodayStoryGroup.ts';

export type TodayStoryViewerProps = {
  groups: ReadonlyArray<TodayStoryGroup>;
  startKey: string | null;
  onClose: () => void;
};
