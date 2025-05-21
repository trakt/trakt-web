import * as m from '$lib/features/i18n/messages.ts';

export function seasonLabel(season: number): string {
  return season === 0 ? m.season_specials() : m.season_number_label({
    number: season,
  });
}
