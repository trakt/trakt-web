<script lang="ts">
  import { browser } from "$app/environment";
  import DarkMode from "$lib/features/theme/components/DarkMode.svelte";
  import LightMode from "$lib/features/theme/components/LightMode.svelte";
  import { ThemeEndpoint } from "$lib/features/theme/ThemeEndpoint";
  import { Theme } from "$lib/features/theme/models/Theme";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { onMount } from "svelte";

  let theme = $state<Theme>(Theme.Light);

  const systemTheme = () =>
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.Dark
      : Theme.Light;

  const coerceDisplayTheme = (value: string | undefined): Theme => {
    if (value === Theme.Dark || value === Theme.Light) return value;
    return systemTheme();
  };

  const isDark = $derived(theme === Theme.Dark);
  const label = $derived(
    isDark ? "Switch design system to light mode" : "Switch design system to dark mode",
  );
  const innerText = $derived(isDark ? "Dark" : "Light");

  const applyTheme = (value: Theme) => {
    if (!browser) return;

    theme = value;
    document.documentElement.dataset.theme = value;

    void fetch(ThemeEndpoint.Set, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme: value }),
    });
  };

  const toggleTheme = () => {
    applyTheme(isDark ? Theme.Light : Theme.Dark);
  };

  onMount(() => {
    theme = coerceDisplayTheme(document.documentElement.dataset.theme);
  });
</script>

<div class="design-system-theme-toggle">
  <Switch
    checked={isDark}
    {innerText}
    {label}
    color="purple"
    onclick={toggleTheme}
  >
    {#snippet icon()}
      {#if isDark}
        <DarkMode />
      {:else}
        <LightMode />
      {/if}
    {/snippet}
  </Switch>
</div>

<style>
  .design-system-theme-toggle {
    display: flex;
    align-items: center;

    :global(.trakt-switch) {
      --custom-width: var(--ni-72);
    }

    :global(svg) {
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }
</style>
