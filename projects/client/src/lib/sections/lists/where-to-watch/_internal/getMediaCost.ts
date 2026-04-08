import { languageTag } from '$lib/features/i18n/index.ts';
import type { StreamOnDemand } from '$lib/requests/models/StreamingServiceOptions.ts';
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
  onDemandService: StreamOnDemand,
  type: CostType,
): string {
  const price = resolvePrice(onDemandService.prices, type);
  if (!price || !onDemandService.currency) {
    return '';
  }

  return toHumanCurrency({
    price,
    currency: onDemandService.currency,
    locale: languageTag(),
  });
}
