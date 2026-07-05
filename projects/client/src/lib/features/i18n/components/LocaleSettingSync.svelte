<script lang="ts">
  import { page } from "$app/state";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { useSettings } from "$lib/sections/settings/_internal/useSettings";
  import { applyLocalePreference } from "../applyLocalePreference";
  import { resolveLocaleAction } from "../resolveLocaleAction";
  import { useLocale } from "./useLocale";

  const locale = useLocale();
  const { user } = useUser();
  const { isAuthorized } = useAuth();
  const { locale: localeSetting } = useSettings();

  /**
   * Reconciles the active locale with the account setting once the user's
   * settings load. The decision is pure (`resolveLocaleAction`); this effect
   * only executes it.
   *
   * `hasReconciled` latches on the first real action, not on mount: while the
   * decision is `none` (auth still resolving) we keep waiting, but once we act
   * we stop. This is required because persisting the setting invalidates the
   * user query, and the refetch re-emits `$user` with the saved locale still
   * empty before the final value lands - without the latch that intermediate
   * emission fires a second, duplicate write.
   */
  let hasReconciled = false;
  $effect(() => {
    if (hasReconciled) {
      return;
    }

    const action = resolveLocaleAction({
      saved: $user.locale,
      active: $locale,
      isAuthorized: $isAuthorized,
      localeSource: page.data.localeSource,
    });

    if (action.type === "none") {
      return;
    }

    hasReconciled = true;

    switch (action.type) {
      case "apply":
        void applyLocalePreference({
          value: action.value,
          setLocale: locale.set,
        });
        return;
      // TRANSITIONAL(locale-backfill): drop this case once existing users are
      // synced; `useAuth`/`useSettings`/`page` imports go with it.
      case "backfill":
        void localeSetting.set(action.value);
        return;
    }
  });
</script>
