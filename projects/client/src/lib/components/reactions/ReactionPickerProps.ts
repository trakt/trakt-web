import type { ReactionPickerOption } from './ReactionPickerOption.ts';

export type ReactionPickerProps = {
  options: ReadonlyArray<ReactionPickerOption>;
  /** The viewer's current pick, held lit. */
  chosen: string | Nil;
  onSelect: (id: string) => void;
  /**
   * Renders a leading close button. Comment reactions open in a bar that has
   * to be dismissed in place; a picker opened in a popover is dismissed by the
   * popover, so it leaves this off.
   */
  onClose?: () => void;
};
