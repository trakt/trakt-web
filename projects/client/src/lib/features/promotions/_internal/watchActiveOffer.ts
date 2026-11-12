import type { PromotionOffer } from '$lib/requests/models/PromotionOffer.ts';
import { time } from '$lib/utils/timing/time.ts';
import { Observable } from 'rxjs';
import { findActiveOffer } from './findActiveOffer.ts';
import { msUntilNextOfferChange } from './msUntilNextOfferChange.ts';

const MAX_TIMEOUT_MS = time.days(24);

export function watchActiveOffer(
  offers: ReadonlyArray<PromotionOffer>,
): Observable<PromotionOffer | null> {
  return new Observable((subscriber) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const check = () => {
      const now = new Date();
      subscriber.next(findActiveOffer({ offers, now }));

      const ms = msUntilNextOfferChange({ offers, now });
      if (ms === null) return;

      timeoutId = setTimeout(check, Math.min(ms, MAX_TIMEOUT_MS));
    };

    check();

    return () => clearTimeout(timeoutId);
  });
}
