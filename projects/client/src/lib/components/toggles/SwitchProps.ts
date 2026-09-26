import type { DpadNavigationType } from '../../features/navigation/models/DpadNavigationType.ts';

/**
 * The flat settings switch. State is carried by the track's colour and the
 * thumb's position - there is deliberately no slot for an icon, inner text or
 * a colour, because the setting's name belongs to the row label and the ON
 * colour belongs to the member's tier.
 *
 * Reach for `NoveltySwitchProps` when a toggle is meant to have a face.
 */
export type SwitchProps = Omit<CheckboxProps, 'checked'> & {
  checked?: boolean;
  indeterminate?: boolean;
  navigationType?: DpadNavigationType;
};
