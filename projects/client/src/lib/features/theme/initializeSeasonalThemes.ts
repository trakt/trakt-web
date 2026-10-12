import { initializeEvents } from '../events/initializeEvents.ts';
import { SEASONAL_THEMES } from './constants.ts';
import { buildLocalDate } from './utils/buildLocalDate.ts';
import { resolveSeasonalWindow } from './utils/resolveSeasonalWindow.ts';

function setScopeId(id: string | null) {
  if (id) document.documentElement.setAttribute('data-seasonal-theme', id);
  else document.documentElement.removeAttribute('data-seasonal-theme');
}

export function initializeSeasonalThemes() {
  const now = new Date();
  const events = Object.fromEntries(
    Object.entries(SEASONAL_THEMES).map(([id, config]) => [
      id,
      resolveSeasonalWindow({ ...config, now }),
    ]),
  );

  initializeEvents({
    events,
    dateFn: buildLocalDate,
    setEvent: setScopeId,
  });
}
