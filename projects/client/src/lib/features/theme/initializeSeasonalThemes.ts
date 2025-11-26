import { initializeEvents } from '../events/initializeEvents.ts';
import { SEASONAL_THEMES } from './constants.ts';
import { buildLocalDate } from './utils/buildLocalDate.ts';

function setScopeId(id: string | null) {
  if (id) document.documentElement.setAttribute('data-seasonal-theme', id);
  else document.documentElement.removeAttribute('data-seasonal-theme');
}

export function initializeSeasonalThemes() {
  initializeEvents({
    events: SEASONAL_THEMES,
    dateFn: buildLocalDate,
    setEvent: setScopeId,
  });
}
