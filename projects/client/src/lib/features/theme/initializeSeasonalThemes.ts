import { activeSeasonalTheme } from './activeSeasonalTheme.ts';
import { msUntilNextSeasonalTheme } from './msUntilNextSeasonalTheme.ts';

function setScopeId(id: string | null) {
  if (id) document.documentElement.setAttribute('data-seasonal-theme', id);
  else document.documentElement.removeAttribute('data-seasonal-theme');
}

function checkAndSchedule() {
  const now = new Date();
  const active = activeSeasonalTheme(now);

  const id = active.at(0) ?? null;
  setScopeId(id);

  const ms = msUntilNextSeasonalTheme(now);
  if (ms !== null && ms > 0) {
    const clamp = Math.min(ms, 2147483647);
    setTimeout(() => checkAndSchedule(), clamp);
  }
}

/**
 * Generic initializer that activates the first matching scope (by SCOPES insertion order)
 * and schedules re-checks for the next transition across all scopes.
 */
export function initializeSeasonalThemes() {
  checkAndSchedule();
}
