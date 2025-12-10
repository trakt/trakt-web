import { BehaviorSubject } from 'rxjs';
import type { CookieConsent } from './models/CookieConsent.ts';

const consent = new BehaviorSubject<CookieConsent | null>(null);

export function useCookieConsent() {
  return {
    setConsent: (value: CookieConsent) => {
      consent.next(value);
    },
    consent: consent.asObservable(),
  };
}
