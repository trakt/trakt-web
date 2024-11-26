<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { THEME_STORE_NAME } from "../constants";
  import type { Theme } from "../models/Theme";
  import { coerceTheme } from "../utils/coerceTheme";

  const { children, theme: initial }: ChildrenProps & { theme: Theme } =
    $props();
  const seed = globalThis.document?.documentElement.dataset.theme ?? initial;
  const themeStore = writable(coerceTheme(seed));
  setContext(THEME_STORE_NAME, themeStore);
</script>

{@render children()}
