import type { TodayShownKeys } from '../models/TodayShownKeys.ts';

type RecordShownParams = { groupKey: string; frameKey: string };

export function recordShown(
  shown: TodayShownKeys,
  { groupKey, frameKey }: RecordShownParams,
): TodayShownKeys {
  return {
    groups: new Set(shown.groups).add(groupKey),
    frames: new Set(shown.frames).add(frameKey),
  };
}
