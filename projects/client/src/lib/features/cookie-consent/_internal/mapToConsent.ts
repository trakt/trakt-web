import { CookieCategory } from '../models/CookieCategory.ts';
import type { CookieConsent } from '../models/CookieConsent.ts';

export function mapToConsent(categories: string[]): CookieConsent {
  const hasNecessary = categories.includes(CookieCategory.Necessary);
  const hasFunctionality = categories.includes(CookieCategory.Functionality);
  const hasAnalytics = categories.includes(CookieCategory.Analytics);

  if (hasNecessary && hasFunctionality && hasAnalytics) return 'all';
  if (hasNecessary && hasFunctionality) return 'functional';

  return 'none';
}
