import { initializeEvents } from '../events/initializeEvents.ts';
import { SEASONAL_THEMES } from './constants.ts';
import { buildLocalDate } from './utils/buildLocalDate.ts';
import { resolveSeasonalWindow } from './utils/resolveSeasonalWindow.ts';

function setScopeId(id: string | null) {
  if (id) document.documentElement.setAttribute('data-seasonal-theme', id);
  else document.documentElement.removeAttribute('data-seasonal-theme');
}

function resolveSeasonalEvents(now: Date) {
  return Object.fromEntries(
    Object.entries(SEASONAL_THEMES).map(([id, config]) => [
      id,
      resolveSeasonalWindow({ ...config, now }),
    ]),
  );
}

export function initializeSeasonalThemes() {
  initializeEvents({
    getEvents: resolveSeasonalEvents,
    dateFn: buildLocalDate,
    setEvent: setScopeId,
  });
}
