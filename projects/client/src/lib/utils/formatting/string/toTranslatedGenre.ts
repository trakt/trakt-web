import * as m from '$lib/features/i18n/messages.ts';

import { normalizeTranslationKey } from './normalizeTranslationKey.ts';

const GENRE_MAP = {
  horror: m.translated_value_genre_horror,
  comedy: m.translated_value_genre_comedy,
  action: m.translated_value_genre_action,
  adventure: m.translated_value_genre_adventure,
  animation: m.translated_value_genre_animation,
  biography: m.translated_value_genre_biography,
  children: m.translated_value_genre_children,
  crime: m.translated_value_genre_crime,
  documentary: m.translated_value_genre_documentary,
  drama: m.translated_value_genre_drama,
  family: m.translated_value_genre_family,
  fantasy: m.translated_value_genre_fantasy,
  game_show: m.translated_value_genre_game_show,
  history: m.translated_value_genre_history,
  home_and_garden: m.translated_value_genre_home_and_garden,
  holiday: m.translated_value_genre_holiday,
  music: m.translated_value_genre_music,
  musical: m.translated_value_genre_musical,
  mystery: m.translated_value_genre_mystery,
  news: m.translated_value_genre_news,
  none: m.translated_value_genre_none,
  reality: m.translated_value_genre_reality,
  romance: m.translated_value_genre_romance,
  short: m.translated_value_genre_short,
  soap: m.translated_value_genre_soap,
  special_interest: m.translated_value_genre_special_interest,
  sporting_event: m.translated_value_genre_sporting_event,
  suspense: m.translated_value_genre_suspense,
  talk_show: m.translated_value_genre_talk_show,
  thriller: m.translated_value_genre_thriller,
  war: m.translated_value_genre_war,
  western: m.translated_value_genre_western,
  anime: m.translated_value_genre_anime,
  superhero: m.translated_value_genre_superhero,
  donghua: m.translated_value_genre_donghua,
  mini_series: m.translated_value_genre_mini_series,
  science_fiction: m.translated_value_genre_science_fiction,
} as const;

export function toTranslatedGenre(
  genre: string | (keyof typeof GENRE_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn = GENRE_MAP[normalizeTranslationKey(genre) as keyof typeof GENRE_MAP];
  return translationFn?.(data) ?? genre;
}
