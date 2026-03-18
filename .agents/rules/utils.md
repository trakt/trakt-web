---
trigger: glob
globs: 'projects/client/src/lib/utils/**'
description: 'Conventions and patterns for everything in lib/utils.'
applyTo: 'projects/client/src/lib/utils/**'
---

# Utils Guidelines

## Overview

`lib/utils/` contains pure helper functions, browser-specific utilities, Svelte
actions, and shared constants. Everything is organized by domain. Before writing
a new helper, check whether the domain folder already has something equivalent.

---

## Pure Functions (most of `utils/`)

All utilities that do not touch the DOM or external state must be pure — same
input always produces the same output.

```ts
// Good
export function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// Bad — side effect inside a utility
export function getDayKey(date: Date): string {
  console.log(date); // ← side effect, belongs at the call site
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
```

---

## Svelte Actions (`actions/`)

Svelte actions manage DOM lifecycle. They always receive an `HTMLElement` as the
first argument and return a destroy object.

```ts
export function myAction(node: HTMLElement, param?: SomeType) {
  // setup
  const handler = () => {/* ... */};
  node.addEventListener('click', handler);

  return {
    update(newParam: SomeType) {
      // optional: called when param changes
    },
    destroy() {
      node.removeEventListener('click', handler);
    },
  };
}
```

**Rules:**

- Actions that need global window events must register through
  `GlobalEventBus.getInstance().register()` — never attach listeners to `window`
  directly.
- Actions should dispatch semantic `CustomEvent`s rather than imperatively
  mutating state.
- Clean up all listeners in `destroy()`.

---

## GlobalEventBus (`events/GlobalEventBus.ts`)

Use for shared window-level event handling inside actions or utilities. Never
instantiate directly — always use `GlobalEventBus.getInstance()`.

```ts
const unregister = GlobalEventBus.getInstance().register('scroll', handler);
// later:
unregister();
```

---

## Formatting (`formatting/`)

Formatting functions are locale-aware and always accept a locale parameter
(last, optional, defaults to `'en'`).

```ts
// date
toHumanDate(today, date, localeKey);
toHumanDay(date, localeKey, 'short' | 'long');
toHumanDuration({ days, hours, minutes, clampAt }, locale);
toHumanETA(today, targetDate, locale);
toRelativeHumanDay(today, date, localeKey);

// number
toHumanNumber(value, locale); // compact notation: 1.2k, 4.5M
toPercentage(value, locale); // 0.75 → "75%"
toTraktRating(rating, locale); // alias for toPercentage
toHumanCurrency({ price, currency, locale });

// intl (Intl.DisplayNames)
toLanguageName(code, languageTag);
toCountryName(code, languageTag);
```

**Rules:**

- Import `LOCALE_MAP` and resolve a `date-fns` locale object when using
  `date-fns` functions.
- Use `Intl.*` APIs for runtime locale resolution — never hard-code locale
  strings inside functions.

---

## Translation Lookup Maps (`formatting/string/toTranslated*.ts`)

When an API value needs to be surfaced as translated UI text, use a lookup map
of i18n message functions.

```ts
const FOO_MAP = {
  bar: m.translated_value_foo_bar,
  baz: m.translated_value_foo_baz,
} as const;

export function toTranslatedFoo(
  value: string | (keyof typeof FOO_MAP),
  data?: Record<string, unknown>,
): string {
  const fn = FOO_MAP[value as keyof typeof FOO_MAP];
  return fn?.(data) ?? value; // fall back to raw value when unknown
}
```

Normalize API strings to map keys with `normalizeTranslationKey(key)` before
lookup when keys may differ in case or separators.

---

## Time Constants (`timing/time.ts`)

Use the `time` helper for all millisecond values — never write raw numbers.

```ts
import { time } from '$lib/utils/timing/time.ts';

time.seconds(30); // 30_000
time.minutes(5); // 300_000
time.hours(3); // 10_800_000
time.days(1); // 86_400_000
```

---

## Assertions (`assert/`)

Use `assertDefined` at boundaries where `null | undefined` would be a
programming error.

```ts
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';

const value = assertDefined(map.get(key), 'Expected key to be present');
```

Never use `assertDefined` to validate external data (use Zod instead). It is
only for internal invariants.

---

## Store Utilities (`store/`)

| Export                     | Purpose                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `WritableSubject<T>`       | `BehaviorSubject` with `.set()` / `.update()` like Svelte writable stores |
| `writable<T>(initial)`     | Factory shorthand for `new WritableSubject(initial)`                      |
| `resolve(stream, timeout)` | Await the first defined value from an RxJS `Observable`                   |
| `toObservable(store)`      | Bridge a Svelte-compatible readable store into an RxJS `Observable`       |

---

## Safe Storage (`storage/safeStorage.ts`)

Always use `safeLocalStorage` / `safeSessionStorage` instead of `localStorage` /
`sessionStorage` to avoid SSR crashes.

```ts
import { safeLocalStorage } from '$lib/utils/storage/safeStorage.ts';

safeLocalStorage.getItem('key');
safeLocalStorage.setItem('key', value);
```

---

## URL Utilities (`url/`)

| Export                            | Purpose                                                               |
| --------------------------------- | --------------------------------------------------------------------- |
| `UrlBuilder`                      | Centralised app route factory — use for all internal navigation paths |
| `buildParamString(params)`        | Serialise a record into a query string (`?foo=bar&baz=1`)             |
| `prependHttps(url, placeholder?)` | Ensure a URL starts with `https://`                                   |
| `prependHttpOrHttps(url)`         | Same, but allows `http://` for localhost                              |
| `setCacheBuster(url)`             | Append `_cb` timestamp to bust CDN caches                             |
| `buildOAuthUrl(clientId, origin)` | Construct the OAuth redirect URL                                      |

**Rules:**

- All internal app routes must go through `UrlBuilder` — do not construct path
  strings by hand.
- Never hard-code `https://` prefixes on URLs coming from the API; always pass
  them through `prependHttps`.

---

## Constants (`constants.ts`, `assets.ts`)

- `constants.ts` — global values (dates, sizes, limits, `NOOP_FN`). Add new
  global constants here.
- `assets.ts` — placeholder image URLs derived from `$app/paths`. Do not
  hard-code placeholder paths elsewhere.

---

## Quick Checklist

Before adding a new utility:

- [ ] Check for an existing equivalent in the relevant domain folder first
- [ ] File name and exported function name are camelCase and match each other
- [ ] Function is pure (unless it's an action or intentional side-effect helper)
- [ ] Internal helpers that don't need to be public live in `_internal/`
- [ ] Locale-aware formatters accept `locale` as an optional last parameter,
      defaulting to `'en'`
- [ ] No direct `window.addEventListener` — use `GlobalEventBus` instead
- [ ] No direct `localStorage` / `sessionStorage` — use `safeLocalStorage` /
      `safeSessionStorage`
- [ ] Time values use `time.seconds/minutes/hours/days(n)`, not raw numbers
