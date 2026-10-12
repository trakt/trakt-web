import { time } from '$lib/utils/timing/time.ts';
import {
  SEASONAL_SPLASH_DISMISSAL_KEY,
  SEASONAL_THEMES,
} from '../constants.ts';
import { resolveSeasonalWindow } from '../utils/resolveSeasonalWindow.ts';
import seasonalCoverTemplate from './seasonalCover.html?raw';

const COVER_FAILSAFE = time.seconds(20);

function resolveWindows(now: Date) {
  const candidates = [-1, 0, 1].map(
    (offset) => new Date(now.getTime() + offset * time.days(1)),
  );

  const windows = Object.values(SEASONAL_THEMES).flatMap((config) =>
    candidates.map((candidate) => ({
      id: config.id,
      ...resolveSeasonalWindow({ ...config, now: candidate }),
    })),
  );

  return [...new Map(windows.map((w) => [JSON.stringify(w), w])).values()];
}

export function renderSeasonalCover(now: Date) {
  return seasonalCoverTemplate
    .replace('%seasonal.windows%', JSON.stringify(resolveWindows(now)))
    .replace('%seasonal.storage%', SEASONAL_SPLASH_DISMISSAL_KEY)
    .replace('%seasonal.failsafe%', `${COVER_FAILSAFE}`);
}
