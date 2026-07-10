<script lang="ts">
  import { page } from "$app/state";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SettingsNavLinks from "./SettingsNavLinks.svelte";
  import SettingsNavMenu from "./SettingsNavMenu.svelte";

  const isGeneralSettings = $derived(
    page.url.pathname === UrlBuilder.settings.general(),
  );
</script>

<RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
  <nav class="trakt-settings-navbar">
    <SettingsNavLinks />
  </nav>
</RenderFor>

<RenderFor audience="authenticated" device={["tablet-sm"]}>
  <SettingsNavMenu />
</RenderFor>

<RenderFor audience="authenticated" device={["mobile"]}>
  {#if !isGeneralSettings}
    <SettingsNavMenu />
  {/if}
</RenderFor>

<style lang="scss">
  .trakt-settings-navbar {
    position: sticky;
    top: calc(
      var(--navbar-actions-bottom, env(safe-area-inset-top, 0)) +
        var(--content-gap)
    );
    align-self: start;

    display: flex;
    flex-direction: column;

    gap: var(--gap-s);
  }
</style>
