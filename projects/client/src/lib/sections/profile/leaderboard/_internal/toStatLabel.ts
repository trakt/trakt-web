import type { AvailableLanguage } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import { toHumanNumber } from '$lib/utils/formatting/number/toHumanNumber.ts';

type StatUnit = 'plays' | 'hours';

/**
 * Formats a leaderboard stat value + unit label (e.g. "8.7K plays"), shared by
 * the ranked rows and the pinned viewer card so the format stays in sync.
 */
export function toStatLabel(
  value: number,
  unit: StatUnit,
  locale: AvailableLanguage,
): string {
  const label = unit === 'plays' ? m.stat_label_plays() : m.stat_label_hours();
  return `${toHumanNumber(value, locale)} ${label}`;
}
