import { languageTag } from '$lib/features/i18n/index.ts';
import { toHumanCurrency } from '$lib/utils/formatting/currency/toHumanCurrency.ts';

export function toVipPriceLabel(price: number): string {
  return toHumanCurrency({ price, currency: 'usd', locale: languageTag() });
}
