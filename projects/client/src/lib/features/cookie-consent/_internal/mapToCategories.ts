import { CookieCategory } from '../models/CookieCategory.ts';
import type { CookieConsent } from '../models/CookieConsent.ts';

export function mapToCategories(consent: CookieConsent): string[] {
  switch (consent) {
    case 'all':
      return [
        CookieCategory.Necessary,
        CookieCategory.Functionality,
        CookieCategory.Analytics,
      ];
    case 'functional':
      return [CookieCategory.Necessary, CookieCategory.Functionality];
    case 'none':
    default:
      return [];
  }
}
