import * as m from '$lib/features/i18n/messages.ts';

export function seasonLabel(season: number, showTitle?: string): string {
  const seasonLabel = season === 0
    ? m.text_season_specials()
    : m.text_season_number({
      number: season,
    });

  return showTitle
    ? m.text_season_activity({ rangeLabel: seasonLabel, title: showTitle })
    : seasonLabel;
}
