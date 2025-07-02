import * as m from '$lib/features/i18n/messages.ts';

export function seasonLabel(season: number): string {
  return season === 0 ? m.text_season_specials() : m.text_season_number({
    number: season,
  });
}
