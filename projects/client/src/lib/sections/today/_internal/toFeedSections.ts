import { getDayKey } from '$lib/utils/date/getDayKey.ts';
import type { TodayFeedSection } from '../models/TodayFeedSection.ts';
import type { TodayPersonAction } from '../models/TodayPersonAction.ts';
import { toDayPart } from './toDayPart.ts';

export function toFeedSections(
  actions: ReadonlyArray<TodayPersonAction>,
): TodayFeedSection[] {
  const sections = actions.reduce((result, action) => {
    const part = toDayPart(action.activityAt);
    const key = `${getDayKey(action.activityAt)}-${part}`;
    const section = result.get(key);

    return result.set(key, {
      key,
      part,
      day: action.activityAt,
      entries: [...(section?.entries ?? []), action],
    });
  }, new Map<string, TodayFeedSection>());

  return Array.from(sections.values());
}
