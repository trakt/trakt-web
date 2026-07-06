<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SettingsNavLinks from "./SettingsNavLinks.svelte";
  import SettingsNavMenu from "./SettingsNavMenu.svelte";
</script>

<RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
  <nav class="trakt-settings-navbar">
    <SettingsNavLinks />
  </nav>
</RenderFor>

<RenderFor audience="authenticated" device={["tablet-sm", "mobile"]}>
  <SettingsNavMenu />
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
