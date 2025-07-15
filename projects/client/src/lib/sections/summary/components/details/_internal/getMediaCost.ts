import { languageTag } from '$lib/features/i18n/index.ts';
import type { StreamOnDemand } from '$lib/requests/models/StreamingServiceOptions.ts';
import { toHumanCurrency } from '$lib/utils/formatting/currency/toHumanCurrency.ts';

export function getMediaCost(onDemandService: StreamOnDemand) {
  const price = onDemandService.prices.rent ?? onDemandService.prices.purchase;
  if (!price || !onDemandService.currency) {
    return '';
  }

  return toHumanCurrency({
    price,
    currency: onDemandService.currency,
    locale: languageTag(),
  });
}
