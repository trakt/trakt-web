<script lang="ts">
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

  const { color } = useTheme();
</script>

<svelte:head>
  <meta name="theme-color" content={$color.navbar} />
</svelte:head>

{@render children()}
