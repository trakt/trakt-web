/**
 * One choice in a reaction picker, flattened out of whichever taxonomy it came
 * from.
 *
 * The picker is shared between comment reactions (7 values, from the API) and
 * media reactions (9 values, a local enum), and those vocabularies are
 * deliberately different - a review gets a `like`, a film gets a `mindblown`.
 * What is NOT different is the control, so the control takes this instead of
 * either domain type.
 */
export type ReactionPickerOption = {
  /** The taxonomy's own value, handed back verbatim to `onSelect`. */
  id: string;
  label: string;
  /** Noto codepoint - see ReactionEmoji. */
  code: string;
};
