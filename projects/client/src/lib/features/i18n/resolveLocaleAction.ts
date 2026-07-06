import { isAvailableLocale } from './isAvailableLocale.ts';
import { resolveLocaleSetting } from './resolveLocaleSetting.ts';

type ResolveLocaleActionProps = {
  saved: string | null | undefined;
  active: string;
  isAuthorized: boolean;
};

/**
 * Decides the single locale reconciliation to run once the user's settings
 * load. Pure so the reactive layer stays a dumb executor:
 *
 * - `apply`: a saved account locale differs from the active one (a fresh,
 *   cookieless session fell back to Accept-Language) - apply it + persist.
 *   This is the cross-device sync mechanism.
 * - `backfill`: an authorized user has no saved locale yet (a new account, or
 *   one who picked before it was stored server-side); persist whatever locale
 *   is active so the account reflects what the user is actually served. This
 *   intentionally captures Accept-Language defaults too, so settings usage
 *   tracks the locales in real use.
 * - `none`: nothing to do.
 *
 * Both actions converge to `saved === active`, so re-running on the next
 * emission resolves to `none` - no loop.
 */
export function resolveLocaleAction({
  saved,
  active,
  isAuthorized,
}: ResolveLocaleActionProps) {
  const toApply = resolveLocaleSetting({ saved, active });
  if (toApply) {
    return { type: 'apply', value: toApply } as const;
  }

  const canBackfill = isAuthorized && !saved && isAvailableLocale(active);
  if (canBackfill) {
    return { type: 'backfill', value: active } as const;
  }

  return { type: 'none' } as const;
}
