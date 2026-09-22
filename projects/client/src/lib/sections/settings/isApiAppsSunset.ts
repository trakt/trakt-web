const API_APPS_SUNSET_AT = new Date('2026-10-22T00:00:00Z');

export function isApiAppsSunset(now: Date = new Date()): boolean {
  return now >= API_APPS_SUNSET_AT;
}
