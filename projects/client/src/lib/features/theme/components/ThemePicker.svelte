<script lang="ts">
  import { WorkerMessage } from "$worker/WorkerMessage";
  import { workerRequest } from "$worker/workerRequest";
  import { Theme } from "../models/Theme";
  import { useTheme } from "../useTheme";
  import DarkMode from "./DarkMode.svelte";
  import LightMode from "./LightMode.svelte";
  import AutoMode from "./SystemMode.svelte";

  import NativeSelect from "$lib/components/select/NativeSelect.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";
  import { useSettings } from "$lib/sections/settings/_internal/useSettings";

  const { set, theme } = useTheme();

  const availableThemes = [Theme.Light, Theme.Dark, Theme.System];

  const { isAuthorized } = useAuth();
  const { theme: themeSettings } = useSettings();

  const themeToTitle: Record<Theme, string> = {
    [Theme.Light]: m.option_text_theme_light(),
    [Theme.Dark]: m.option_text_theme_dark(),
    [Theme.System]: m.option_text_theme_system(),
  };

  async function submitTheme(value: Theme) {
    set(value);
    await workerRequest(WorkerMessage.CacheBust);

    if ($isAuthorized) {
      await themeSettings.set(value);
    }
  }

  const options = $derived(
    availableThemes.map((theme) => ({
      value: theme,
      text: themeToTitle[theme],
      label: themeToTitle[theme],
    })),
  );
</script>

<NativeSelect value={$theme} onChange={submitTheme} {options}>
  {#snippet icon()}
    {#if $theme === Theme.System}
      <AutoMode />
    {:else if $theme === Theme.Dark}
      <DarkMode />
    {:else}
      <LightMode />
    {/if}
  {/snippet}
</NativeSelect>
