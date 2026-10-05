export type TodayStoryTapZone = 'previous' | 'flip' | 'next';

export type TodayStoryTapZonesProps = {
  isFlipped: boolean;
  onTap: (zone: TodayStoryTapZone, event: MouseEvent) => void;
  onPressStart: (event: PointerEvent) => void;
  onPressEnd: () => void;
};
