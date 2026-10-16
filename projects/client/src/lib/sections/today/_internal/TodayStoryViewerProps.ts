import type { TodayOpenSource } from '../models/TodayOpenSource.ts';
import type { TodayStoryGroup } from '../models/TodayStoryGroup.ts';

export type TodayStoryViewerProps = {
  groups: ReadonlyArray<TodayStoryGroup>;
  startKey: string | null;
  source: TodayOpenSource;
  onClose: () => void;
};
