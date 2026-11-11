import { getIntlLocale, languageTag } from '$lib/features/i18n/index.ts';
import * as m from '$lib/features/i18n/messages.ts';
import type { AddToListResult } from '$lib/requests/queries/users/addToListRequest.ts';

export function toListLimitMessage(result: AddToListResult): string | null {
  if (result.status !== 'list-full' && result.status !== 'lists-full') {
    return null;
  }

  const limit = new Intl.NumberFormat(getIntlLocale(languageTag())).format(
    result.limit,
  );

  if (result.status === 'list-full')
    return m.text_list_item_limit_reached({ limit });

  return result.isVip
    ? m.text_lists_item_limit_reached_vip({ limit })
    : m.text_lists_item_limit_reached_free({ limit });
}
