import type { AnyReaction } from '$lib/requests/models/AnyReaction.ts';
import { toTranslatedReaction } from '$lib/utils/formatting/string/toTranslatedReaction.ts';
import type { ReactionPickerOption } from './ReactionPickerOption.ts';
import { REACTION_KEYWORDS, REACTIONS_CODE_MAP } from './constants.ts';

export function toReactionPickerOptions<T extends AnyReaction>(
  reactions: ReadonlyArray<T>,
): ReadonlyArray<ReactionPickerOption<T>> {
  return reactions.map((reaction) => ({
    id: reaction,
    label: toTranslatedReaction(reaction),
    keywords: REACTION_KEYWORDS[reaction],
    code: REACTIONS_CODE_MAP[reaction],
  }));
}
