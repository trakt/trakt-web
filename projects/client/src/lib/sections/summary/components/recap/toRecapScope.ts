import * as m from '$lib/features/i18n/messages.ts';

export function toRecapScope(caughtUpSeason: number) {
  return caughtUpSeason === 1
    ? m.text_season_number({ number: caughtUpSeason })
    : m.text_recap_scope_seasons({ number: caughtUpSeason });
}
