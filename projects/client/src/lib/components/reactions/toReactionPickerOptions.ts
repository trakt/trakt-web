import { toTranslatedReaction } from '$lib/utils/formatting/string/toTranslatedReaction.ts';
import type { ReactionPickerOption } from './ReactionPickerOption.ts';
import { REACTIONS_CODE_MAP } from './reactionCodeMap.ts';
import { reactionsInOrder } from './reactionsInOrder.ts';

/**
 * The whole taxonomy, flattened for the picker.
 *
 * Both surfaces that open a picker - a review's react button and a title's
 * badge - were building this identically, which is two places to touch when a
 * reaction is added and two chances to label one of them differently.
 *
 * A function rather than a constant: the labels come from the message
 * catalogue, and a module-level constant would fix them to whichever locale
 * happened to be active when the module first loaded.
 */
export function toReactionPickerOptions(): ReactionPickerOption[] {
  return reactionsInOrder.map((reaction) => ({
    id: reaction,
    label: toTranslatedReaction(reaction),
    code: REACTIONS_CODE_MAP[reaction],
  }));
}
