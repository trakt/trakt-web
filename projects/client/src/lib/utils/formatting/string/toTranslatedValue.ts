import * as m from '$lib/features/i18n/messages.ts';
import { toMessageKey } from '$lib/utils/string/toMessageKey.ts';

type IntlStore = Record<string, (data?: Record<string, unknown>) => string>;

const KEY_PREFIX = 'translated_value';

export function toTranslatedValue(
  valuePrefix: string,
  value: string,
  data?: Record<string, unknown>,
): string {
  const prefix = `${KEY_PREFIX}_${valuePrefix}`;
  const messages = m as unknown as IntlStore;
  const key = toMessageKey(prefix, value);

  return messages[key]?.(data) ?? value;
}
