<script lang="ts">
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
   * The latch is keyed on the user id, not a plain boolean: this component
   * lives in the root layout and survives logout/login, so a boolean would
   * reconcile the first session and then never again. Keying on `$user.id`
   * lets each session reconcile once, while still absorbing the duplicate
   * emission from persisting the setting (the invalidated user query refetches
   * and re-emits with the saved locale still empty - same id, so we skip it).
   */
  let reconciledUserId: string | number | undefined;
  $effect(() => {
    const userId = $user.id;
    if (reconciledUserId === userId) {
      return;
    }

    const action = resolveLocaleAction({
      saved: $user.locale,
      active: $locale,
      isAuthorized: $isAuthorized,
    });

    if (action.type === "none") {
      return;
    }

    reconciledUserId = userId;

    switch (action.type) {
      case "apply":
        void applyLocalePreference({
          value: action.value,
          setLocale: locale.set,
        });
        return;
      case "backfill":
        void localeSetting.set(action.value);
        return;
    }
  });
</script>
