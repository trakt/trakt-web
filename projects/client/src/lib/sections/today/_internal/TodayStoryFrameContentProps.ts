import type { TodayStoryFrame } from '../models/TodayStoryFrame.ts';
import type { TodayStoryTapZonesProps } from './TodayStoryTapZonesProps.ts';

export type TodayStoryFrameContentProps =
  & { frame: TodayStoryFrame; isFlipped?: boolean }
  & Partial<Omit<TodayStoryTapZonesProps, 'isFlipped'>>;
