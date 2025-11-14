import { readonly, writable } from 'svelte/store';
import type { CookieConsent } from './models/CookieConsent.ts';

const consent = writable<CookieConsent | null>(null);

export function useCookieConsent() {
  return {
    setConsent: (value: CookieConsent) => {
      consent.set(value);
    },
    consent: readonly(consent),
  };
}
