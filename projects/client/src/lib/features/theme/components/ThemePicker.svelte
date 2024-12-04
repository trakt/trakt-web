<script lang="ts">
  import { THEME_FIELD_NAME } from "../constants";
  import type { ThemeResponse } from "../handle";
  import { Theme } from "../models/Theme";
  import { nextTheme } from "../nextTheme";
  import { ThemeEndpoint } from "../ThemeEndpoint";
  import { useTheme } from "../useTheme";
  import ThemeToggleIcon from "./ThemeToggleIcon.svelte";

  const { set, theme } = useTheme();

  const submitTheme = async (value: Theme) => {
    const result = await fetch(ThemeEndpoint.Set, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [THEME_FIELD_NAME]: value }),
    }).then((res) => res.json() as Promise<ThemeResponse>);

    set(result.theme ?? $theme);
  };
</script>

<form
  onsubmit={(ev) => {
    ev.preventDefault();
    submitTheme(nextTheme($theme));
  }}
>
  <ThemeToggleIcon theme={$theme} />
</form>
