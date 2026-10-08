import type { GamePhase } from './GamePhase.ts';
import type { PanelRole } from './PanelRole.ts';

const SETTLED_ROLES: ReadonlyArray<PanelRole> = [
  'known',
  'mystery',
  'upcoming',
];
const ADVANCING_ROLES: ReadonlyArray<PanelRole> = [
  'leaving',
  'known',
  'mystery',
];

export function toPanelRoles(phase: GamePhase): ReadonlyArray<PanelRole> {
  return phase === 'advance' ? ADVANCING_ROLES : SETTLED_ROLES;
}
