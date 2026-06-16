---
trigger: glob
globs: 'projects/client/src/lib/utils/**'
description: 'Conventions and patterns for everything in lib/utils.'
applyTo: 'projects/client/src/lib/utils/**'
---

# Utils Guidelines

## Overview

`lib/utils/` holds pure helpers, browser utilities, Svelte actions, shared
constants. Organized by domain. Before adding a helper, check if domain folder
has an equivalent.

---

## Pure Functions (most of `utils/`)

Utilities that don't touch DOM or external state must be pure - same input
always yields same output.

```ts
// Good
export function getDayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// Bad - side effect inside utility
export function getDayKey(date: Date): string {
  console.log(date); // side effect, belongs at call site
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
```

---

## Svelte Actions (`actions/`)

Manage DOM lifecycle. Receive `HTMLElement` as first argument, return destroy
object.

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

- Actions needing global window events must register via
  `GlobalEventBus.getInstance().register()` - never attach listeners to `window`
  directly.
- Dispatch semantic `CustomEvent`s over imperatively mutating state.
- Clean up all listeners in `destroy()`.

---

## GlobalEventBus (`events/GlobalEventBus.ts`)

For shared window-level event handling in actions or utilities. Never
instantiate directly - use `GlobalEventBus.getInstance()`.

```ts
const unregister = GlobalEventBus.getInstance().register('scroll', handler);
// later:
unregister();
```

---

## Formatting (`formatting/`)

Formatters are locale-aware; always accept locale param (last, optional,
defaults to `'en'`).

```ts
// date
toHumanDate(today, date, localeKey);
toHumanDay(date, localeKey, 'short' | 'long');
toHumanDuration({ days, hours, minutes, clampAt }, locale);
toHumanETA(today, targetDate, locale);
toRelativeHumanDay(today, date, localeKey);

// number
toHumanNumber(value, locale); // compact notation: 1.2k, 4.5M
toPercentage(value, locale); // 0.75 -> "75%"
toTraktRating(rating, locale); // alias for toPercentage
toHumanCurrency({ price, currency, locale });

// intl (Intl.DisplayNames)
toLanguageName(code, languageTag);
toCountryName(code, languageTag);
```

**Rules:**

- Import `LOCALE_MAP` and resolve `date-fns` locale object when using `date-fns`
  functions.
- Use `Intl.*` APIs for runtime locale resolution - never hard-code locale
  strings inside functions.

---

## Translation Lookup Maps (`formatting/string/toTranslated*.ts`)

When API value needs translated UI text, use lookup map of i18n message
functions.

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

Use `time` helper for all millisecond values - never raw numbers.

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

Never use `assertDefined` to validate external data (use Zod). Internal
invariants only.

---

## Store Utilities (`store/`)

| Export                     | Purpose                                                                          |
| -------------------------- | -------------------------------------------------------------------------------- |
| `WritableSubject<T>`       | `BehaviorSubject` with `.set()` / `.update()` like Svelte writable stores        |
| `writable<T>(initial)`     | Factory shorthand for `new WritableSubject(initial)`                             |
| `resolve(stream, timeout)` | Await first defined value from RxJS `Observable`                                 |
| `valueObservable(value)`   | Lift a static value into a never-completing `Observable<T>` (prefer over `of()`) |
| `fromRune(accessor)`       | Bridge a Svelte 5 rune-driven accessor into an `Observable<T>` via `$effect.pre` |
| `multicast(graceMs?)`      | `share + ReplaySubject(1) + timer` operator for multi-subscriber Observables     |

---

## Safe Storage (`storage/safeStorage.ts`)

Always use `safeLocalStorage` / `safeSessionStorage` over `localStorage` /
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
| `UrlBuilder`                      | Centralised app route factory - use for all internal navigation paths |
| `buildParamString(params)`        | Serialise record into query string (`?foo=bar&baz=1`)                 |
| `prependHttps(url, placeholder?)` | Ensure URL starts with `https://`                                     |
| `prependHttpOrHttps(url)`         | Same, but allows `http://` for localhost                              |
| `setCacheBuster(url)`             | Append `_cb` timestamp to bust CDN caches                             |
| `buildOAuthUrl(clientId, origin)` | Construct OAuth redirect URL                                          |

**Rules:**

- Internal app routes must go through `UrlBuilder` - don't construct path
  strings by hand.
- Never hard-code `https://` prefixes on URLs from API; pass through
  `prependHttps`.

---

## Constants (`constants.ts`, `assets.ts`)

- `constants.ts` - global values (dates, sizes, limits, `NOOP_FN`). Add new
  global constants here.
- `assets.ts` - placeholder image URLs derived from `$app/paths`. Don't
  hard-code placeholder paths elsewhere.

---

## Quick Checklist

Before adding a utility:

- [ ] Check for existing equivalent in relevant domain folder first
- [ ] File name and exported function name are camelCase and match
- [ ] Function is pure (unless action or intentional side-effect helper)
- [ ] Internal helpers not needing public exposure live in `_internal/`
- [ ] Locale-aware formatters accept `locale` as optional last param, defaulting
      to `'en'`
- [ ] No direct `window.addEventListener` - use `GlobalEventBus`
- [ ] No direct `localStorage` / `sessionStorage` - use `safeLocalStorage` /
      `safeSessionStorage`
- [ ] Time values use `time.seconds/minutes/hours/days(n)`, not raw numbers
