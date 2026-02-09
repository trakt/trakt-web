import * as m from '$lib/features/i18n/messages.ts';

import { normalizeTranslationKey } from './normalizeTranslationKey.ts';

const VIDEO_TYPE_MAP = {
  trailer: m.translated_value_video_type_trailer,
  clip: m.translated_value_video_type_clip,
  teaser: m.translated_value_video_type_teaser,
  featurette: m.translated_value_video_type_featurette,
  recap: m.translated_value_video_type_recap,
  behind_the_scenes: m.translated_value_video_type_behind_the_scenes,
  bloopers: m.translated_value_video_type_bloopers,
  opening_credits: m.translated_value_video_type_opening_credits,
} as const;

export function toTranslatedVideoType(
  videoType: string | (keyof typeof VIDEO_TYPE_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn = VIDEO_TYPE_MAP[
    normalizeTranslationKey(videoType) as keyof typeof VIDEO_TYPE_MAP
  ];
  return translationFn?.(data) ?? videoType;
}
