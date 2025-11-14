import { time } from '$lib/utils/timing/time.ts';
import type { CookieConsent } from '../models/CookieConsent.ts';
import { mapToCategories } from './mapToCategories.ts';

export function getConsentCookieValue(now: Date, consent: CookieConsent) {
  const expirationDate = new Date(now.getTime() + time.months(6));

  return {
    categories: mapToCategories(consent),
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
