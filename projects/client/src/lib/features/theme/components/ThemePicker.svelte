<script lang="ts">
  import { WorkerMessage } from "$worker/WorkerMessage";
  import { workerRequest } from "$worker/workerRequest";
  import { Theme } from "../models/Theme";
  import { useTheme } from "../useTheme";
  import DarkMode from "./DarkMode.svelte";
  import LightMode from "./LightMode.svelte";
  import AutoMode from "./SystemMode.svelte";

  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
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
</script>

<div class="theme-picker-container">
  <div class="theme-icon">
    {#if $theme === Theme.System}
      <AutoMode />
    {:else if $theme === Theme.Dark}
      <DarkMode />
    {:else}
      <LightMode />
    {/if}
  </div>
  <select
    onchange={(ev) => submitTheme(ev.currentTarget.value as Theme)}
    data-dpad-navigation={DpadNavigationType.Item}
  >
    {#each availableThemes as option}
      <option
        selected={$theme === option}
        value={option}
        aria-label={themeToTitle[option]}
      >
        {themeToTitle[option]}
      </option>
    {/each}
  </select>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .theme-picker-container {
    position: relative;
    width: var(--ni-42);
    height: var(--ni-42);
    border-radius: 50%;

    &:has(select:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--purple-500);
    }

    .theme-icon {
      width: calc(var(--ni-32) * 0.9);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--ni-24);
    }

    @include for-mouse {
      &:hover {
        background-color: var(--cm-background-30);
      }
    }
  }

  select {
    width: 100%;
    height: 100%;
    font-size: var(--ni-16);
    border: none;
    background-color: transparent;
    text-align: center;
    appearance: none;
    cursor: pointer;
    opacity: 0;
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
  }
</style>
