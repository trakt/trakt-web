import { isAvailableLocale } from './isAvailableLocale.ts';

type ResolveLocaleSettingProps = {
  saved: string | null | undefined;
  active: string;
};

/**
 * Decides whether a saved account locale should replace the active one.
 * Returns the locale to apply, or null when there is nothing to do:
 * no saved value, an unknown/removed locale, or one that already matches.
 */
export function resolveLocaleSetting({
  saved,
  active,
}: ResolveLocaleSettingProps): string | null {
  if (!saved) {
    return null;
  }

  if (!isAvailableLocale(saved)) {
    return null;
  }

  if (saved === active) {
    return null;
  }

  return saved;
}
