import { isAvailableLocale } from './isAvailableLocale.ts';
import { resolveLocaleSetting } from './resolveLocaleSetting.ts';

type ResolveLocaleActionProps = {
  saved: string | null | undefined;
  active: string;
  isAuthorized: boolean;
  localeSource: 'cookie' | 'header';
};

/**
 * Decides the single locale reconciliation to run once the user's settings
 * load. Pure so the reactive layer stays a dumb executor:
 *
 * - `apply`: a saved account locale differs from the active one (a fresh,
 *   cookieless session fell back to Accept-Language) - apply it + persist.
 *   Permanent: this is the cross-device sync mechanism.
 * - `backfill`: TRANSITIONAL(locale-backfill) - the active locale was a
 *   deliberate cookie pick that predates the account setting; persist it so
 *   settings usage reflects the choice. Remove once existing users are synced,
 *   collapsing this back to `resolveLocaleSetting`.
 * - `none`: nothing to do.
 *
 * Both actions converge to `saved === active`, so re-running on the next
 * emission resolves to `none` - no loop, no latch needed.
 */
export function resolveLocaleAction({
  saved,
  active,
  isAuthorized,
  localeSource,
}: ResolveLocaleActionProps) {
  const toApply = resolveLocaleSetting({ saved, active });
  if (toApply) {
    return { type: 'apply', value: toApply } as const;
  }

  // TRANSITIONAL(locale-backfill): remove this branch once existing users are
  // synced; the function then reduces to `resolveLocaleSetting`.
  const canBackfill = isAuthorized &&
    !saved &&
    localeSource === 'cookie' &&
    isAvailableLocale(active);
  if (canBackfill) {
    return { type: 'backfill', value: active } as const;
  }

  return { type: 'none' } as const;
}
