import { languageTag } from '$lib/features/i18n/index.ts';
import { toHumanCurrency } from '$lib/utils/formatting/currency/toHumanCurrency.ts';
import type { StreamOnDemand } from '../../../../../requests/models/StreamingServiceOptions.ts';

export function getMediaCost(onDemandService: StreamOnDemand) {
  const price = onDemandService.prices.rent ?? onDemandService.prices.purchase;
  if (!price) {
    return '';
  }

  return toHumanCurrency({
    price,
    currency: onDemandService.currency,
    locale: languageTag(),
  });
}
