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
  /**
   * Show only this many at rest, with a `+` that opens search for the rest.
   * Left off, every option is on the row - which is the right answer for a
   * short taxonomy, and why comment reactions never needed it.
   */
  quickCount?: number;
  /**
   * Ids to float to the front of the quick row - the viewer's own recent
   * picks. Only meaningful alongside `quickCount`.
   */
  preferred?: ReadonlyArray<string>;
};
