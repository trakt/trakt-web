<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { iffy } from "$lib/utils/function/iffy";
  import { BehaviorSubject } from "rxjs";
  import { setContext } from "svelte";
  import { THEME_COOKIE_NAME } from "../constants";
  import type { Theme } from "../models/Theme";
  import { useTheme } from "../useTheme";
  import { coerceTheme } from "../utils/coerceTheme";

  const { children, theme: initial }: ChildrenProps & { theme: Theme } =
    $props();

  iffy(() => {
    const seed = globalThis.document?.documentElement.dataset.theme ?? initial;
    const themeStore = new BehaviorSubject(coerceTheme(seed));
    setContext(THEME_COOKIE_NAME, themeStore);
  });

  const { color, set, theme } = useTheme();
  const { user } = useUser();

  $effect(() => {
    if (!$user) return;

    if ($theme !== $user.preferredTheme) {
      set($user.preferredTheme);
    }
  });
</script>

<svelte:head>
  <meta name="theme-color" content={$color.navbar} />
</svelte:head>

{@render children()}
