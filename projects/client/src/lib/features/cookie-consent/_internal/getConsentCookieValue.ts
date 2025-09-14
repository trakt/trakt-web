import { time } from '$lib/utils/timing/time.ts';

export function getConsentCookieValue(now: Date) {
  const expirationDate = new Date(now.getTime() + time.months(6));

  return {
    categories: ['necessary', 'functionality', 'analytics'],
    revision: 4,
    data: {
      expiration: expirationDate.toUTCString(),
      saved: now.toUTCString(),
    },
    consentTimestamp: now.toISOString(),
    consentId: crypto.randomUUID(),
    services: {
      necessary: [],
      functionality: [],
      analytics: [],
      advertising: [],
    },
    lastConsentTimestamp: now.toISOString(),
    expirationTime: expirationDate.getTime(),
  };
}
