<script lang="ts">
  import { browser } from "$app/environment";
  import { applyAction, enhance } from "$app/forms";
  import { store } from "$lib/features/theme/store";
  import { THEME_FIELD_NAME } from "../constants";
  import type { Theme } from "../models/Theme";
  import type { ThemeSubmitFunction } from "../models/ThemeSubmitFunction";
  import ThemeToggleIcon from "./ThemeToggleIcon.svelte";

  let { theme: seed }: { theme: Theme } = $props();

  const { theme, nextTheme, setTheme } = store({
    seed,
    browser,
  });

  const submitTheme: ThemeSubmitFunction = async () => {
    return async ({ result }) => {
      await applyAction(result);

      if (result.type !== "success") {
        return;
      }

      setTheme(result.data?.theme ?? $theme);
    };
  };
</script>

<form method="POST" action="/theme/?/persist" use:enhance={submitTheme}>
  <input name={THEME_FIELD_NAME} value={nextTheme($theme)} hidden />
  <ThemeToggleIcon theme={$theme} />
</form>
