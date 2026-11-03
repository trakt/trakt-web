import { languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { StreamingServiceOption } from '$lib/requests/models/StreamingServiceOptions.ts';
import { toHumanCurrency } from '$lib/utils/formatting/currency/toHumanCurrency.ts';

const SEPARATOR = '·';

/**
 * The offer line under a provider name in the header's watch list.
 *
 * Unlike the existing where-to-watch row - which shows a single price - this
 * renders the **full** offer on one line ("Rent 3.99 · Buy 9.99"). A row that
 * folds several plans of one service says how many ("Stream · 2 plans"). That is the
 * point of the design's vertical list: it has the width to state every offer
 * type, which the old horizontal grid did not.
 */
export function toProviderOffer(
  service: StreamingServiceOption,
  planCount = 1,
): string {
  if (service.type === 'streaming') {
    const terms = planCount > 1
      ? m.text_streaming_plan_count({ count: planCount })
      : m.text_included();
    return `${m.text_stream()} ${SEPARATOR} ${terms}`;
  }

  if (service.type === 'free') {
    return m.list_title_streaming_free();
  }

  const locale = languageTag();
  const currency = service.currency;

  const toPrice = (price: number | undefined) =>
    price && currency ? toHumanCurrency({ price, currency, locale }) : null;

  const rent = toPrice(service.prices.rent);
  const purchase = toPrice(service.prices.purchase);

  return [
    rent ? `${m.text_rent()} ${rent}` : null,
    purchase ? `${m.text_buy()} ${purchase}` : null,
  ]
    .filter(Boolean)
    .join(` ${SEPARATOR} `);
}
