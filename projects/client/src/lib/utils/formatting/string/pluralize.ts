import * as m from '$lib/features/i18n/messages.ts';

const SINGLE_PREFIX = 'single_';

type IntlStore = Record<string, ({ count }: { count: number }) => string>;

/*
  FIXME:
    Switch to variants when @inlang/paraglide-sveltekit
    upgrades to paraglide-js v2+
    https://inlang.com/m/gerre34r/library-inlang-paraglideJs/variants
*/
export function pluralize(key: string, count: number) {
  const messages = m as unknown as IntlStore;

  const prefix = count === 1 ? SINGLE_PREFIX : '';
  const messageKey = `${prefix}${key}`;

  return messages[messageKey]?.({ count }) ?? messageKey;
}
