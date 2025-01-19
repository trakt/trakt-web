import { type AvailableLanguage } from '$lib/features/i18n/index.ts';

type ToHumanCurrencyProps = {
  price: number;
  currency: string;
  locale: AvailableLanguage;
};

export function toHumanCurrency({
  price,
  currency,
  locale,
}: ToHumanCurrencyProps): string {
  const inf = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  });

  return inf.format(price);
}
