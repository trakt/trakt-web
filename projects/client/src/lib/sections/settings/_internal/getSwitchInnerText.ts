import {
  SWITCH_NO_LABEL,
  SWITCH_OFF_LABEL,
  SWITCH_ON_LABEL,
  SWITCH_YES_LABEL,
} from './constants.ts';

/*
  These labels are not translated to make sure they always
  fit in the switch toggle
*/
type Mode = 'on-off' | 'yes-no';
export function getSwitchInnerText(
  isEnabled: boolean,
  mode: Mode = 'on-off',
): string {
  if (mode === 'yes-no') {
    return isEnabled ? SWITCH_YES_LABEL : SWITCH_NO_LABEL;
  }

  return isEnabled ? SWITCH_ON_LABEL : SWITCH_OFF_LABEL;
}
