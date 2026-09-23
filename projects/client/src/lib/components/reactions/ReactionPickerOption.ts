/**
 * One choice in the reaction picker, flattened out of the taxonomy.
 *
 * The picker is shared between a review's reactions and a title's. They run on
 * the same seven values, but the control still takes this rather than the
 * domain type, so a call site can label and order its own row.
 */
export type ReactionPickerOption = {
  /** The taxonomy's own value, handed back verbatim to `onSelect`. */
  id: string;
  label: string;
  /** Noto codepoint - see ReactionEmoji. */
  code: string;
};
