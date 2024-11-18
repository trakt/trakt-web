<script lang="ts">
  import { browser } from "$app/environment";
  import { store } from "$lib/features/theme/store";
  import { THEME_FIELD_NAME } from "../constants";
  import type { ThemeResponse } from "../handle";
  import type { Theme } from "../models/Theme";
  import { ThemeEndpoint } from "../ThemeEndpoint";
  import ThemeToggleIcon from "./ThemeToggleIcon.svelte";

  let { theme: seed }: { theme: Theme } = $props();

  const { theme, nextTheme, setTheme } = store({
    seed,
    browser,
  });

  const submitTheme = async (value: Theme) => {
    const result = await fetch(ThemeEndpoint.Set, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [THEME_FIELD_NAME]: value }),
    }).then((res) => res.json() as Promise<ThemeResponse>);

    setTheme(result.theme ?? $theme);
  };
</script>

<form onsubmit={(ev) => submitTheme(nextTheme($theme))}>
  <ThemeToggleIcon theme={$theme} />
</form>
