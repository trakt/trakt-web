import { detachAll } from '../shared/detachAll.ts';
import { attachCalendarSun } from './attachCalendarSun.ts';
import { attachDaysOnArrakis } from './attachDaysOnArrakis.ts';
import { attachIbadEyes } from './attachIbadEyes.ts';
import { attachMonolith } from './attachMonolith.ts';
import { attachSandDrifts } from './attachSandDrifts.ts';
import { attachStatLabels } from './attachStatLabels.ts';

export function decorateDune() {
  return detachAll([
    attachSandDrifts(),
    attachMonolith(),
    attachDaysOnArrakis(),
    attachCalendarSun(),
    attachIbadEyes(),
    attachStatLabels(),
  ]);
}
