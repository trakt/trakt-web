<script lang="ts">
  import { browser } from "$app/environment";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getDeviceType } from "$lib/utils/devices/getDeviceType.ts";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { THEME_COOKIE_NAME } from "../constants";
  import type { Theme } from "../models/Theme";
  import { useTheme } from "../useTheme";
  import { coerceTheme } from "../utils/coerceTheme";

  const { children, theme: initial }: ChildrenProps & { theme: Theme } =
    $props();
  const seed = globalThis.document?.documentElement.dataset.theme ?? initial;
  const themeStore = writable(coerceTheme(seed));
  setContext(THEME_COOKIE_NAME, themeStore);

  const { color, set, theme } = useTheme();
  const { user } = useUser();
  const isTV = $derived(browser && getDeviceType(navigator.userAgent) === "tv");

  $effect(() => {
    if (!$user || isTV) return;

    if ($theme !== $user.preferredTheme) {
      set($user.preferredTheme);
    }
  });
</script>

<svelte:head>
  <meta name="theme-color" content={$color.navbar} />
</svelte:head>

{@render children()}
