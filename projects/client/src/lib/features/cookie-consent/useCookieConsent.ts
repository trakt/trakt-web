import { derived, writable } from 'svelte/store';

const hasConsent = writable(false);

export function useCookieConsent() {
  return {
    setConsent: (consent: boolean) => {
      hasConsent.set(consent);
    },
    hasConsent: derived(hasConsent, ($hasConsent) => $hasConsent),
  };
}
