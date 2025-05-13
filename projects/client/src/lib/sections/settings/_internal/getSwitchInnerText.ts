import { SWITCH_OFF_LABEL, SWITCH_ON_LABEL } from './constants.ts';

/*
  These labels are not translated to make sure they always
  fit in the switch toggle
*/
export function getSwitchInnerText(isEnabled: boolean) {
  return isEnabled ? SWITCH_ON_LABEL : SWITCH_OFF_LABEL;
}
