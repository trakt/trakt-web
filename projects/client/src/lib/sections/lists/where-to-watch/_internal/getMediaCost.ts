import { languageTag } from '$lib/features/i18n/index.ts';
import type {
  StreamingServiceOption,
  StreamOnDemand,
} from '$lib/requests/models/StreamingServiceOptions.ts';
import { toHumanCurrency } from '$lib/utils/formatting/currency/toHumanCurrency.ts';

export type CostType = 'rent' | 'purchase' | 'any';

function resolvePrice(
  prices: StreamOnDemand['prices'],
  type: CostType,
): number | undefined {
  if (type === 'rent') return prices.rent;
  if (type === 'purchase') return prices.purchase;
  return prices.rent ?? prices.purchase;
}

export function getMediaCost(
  service: StreamingServiceOption,
  type: CostType,
): string {
  if (service.type !== 'on-demand') {
    return '';
  }

  const price = resolvePrice(service.prices, type);
  if (!price || !service.currency) {
    return '';
  }

  return toHumanCurrency({
    price,
    currency: service.currency,
    locale: languageTag(),
  });
}
