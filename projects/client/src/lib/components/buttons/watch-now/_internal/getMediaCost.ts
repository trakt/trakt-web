import { languageTag } from '$lib/features/i18n';
import type { WatchNowOnDemand } from '$lib/requests/models/WatchNowServices';
import { toHumanCurrency } from '$lib/utils/formatting/currency/toHumanCurrency';

export function getMediaCost(onDemandService: WatchNowOnDemand) {
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
