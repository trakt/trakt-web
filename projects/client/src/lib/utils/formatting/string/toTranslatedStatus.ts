import * as m from '$lib/features/i18n/messages.ts';
import { normalizeTranslationKey } from './normalizeTranslationKey.ts';

const STATUS_MAP = {
  released: m.translated_value_status_released,
  planned: m.translated_value_status_planned,
  post_production: m.translated_value_status_post_production,
  canceled: m.translated_value_status_canceled,
  in_production: m.translated_value_status_in_production,
  rumored: m.translated_value_status_rumored,
  ended: m.translated_value_status_ended,
  returning_series: m.translated_value_status_returning_series,
  pilot: m.translated_value_status_pilot,
  continuing: m.translated_value_status_continuing,
  upcoming: m.translated_value_status_upcoming,
  unknown: m.translated_value_status_unknown,
} as const;

export function toTranslatedStatus(
  status: string | (keyof typeof STATUS_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn =
    STATUS_MAP[normalizeTranslationKey(status) as keyof typeof STATUS_MAP];
  return translationFn?.(data) ?? status;
}
