import * as m from '$lib/features/i18n/messages.ts';

const REACTION_MAP = {
  like: m.translated_value_reaction_like,
  dislike: m.translated_value_reaction_dislike,
  love: m.translated_value_reaction_love,
  laugh: m.translated_value_reaction_laugh,
  shocked: m.translated_value_reaction_shocked,
  bravo: m.translated_value_reaction_bravo,
  spoiler: m.translated_value_reaction_spoiler,
} as const;

export function toTranslatedReaction(
  reaction: string | (keyof typeof REACTION_MAP),
  data?: Record<string, unknown>,
): string {
  const translationFn = REACTION_MAP[reaction as keyof typeof REACTION_MAP];
  return translationFn?.(data) ?? reaction;
}
