<script lang="ts">
  import SettingsFrame from "$lib/components/frame/SettingsFrame.svelte";
  import RawExport from "./RawExport.svelte";
</script>

<div class="trakt-advanced-settings">
  <SettingsFrame />
  <div class="export-section">
    <RawExport />
  </div>
</div>

<style>
  .export-section {
    margin-top: var(--ni-16);
  }
  .trakt-advanced-settings {
    width: 100%;
    max-width: var(--ni-640);

    border-radius: var(--border-radius-l);
    overflow: hidden;

    background-color: var(--color-card-background);

    box-shadow:
      0px var(--ni-16) var(--ni-8) 0px
        color-mix(in srgb, var(--color-shadow) 2%, transparent),
      0px var(--ni-8) var(--ni-4) 0px
        color-mix(in srgb, var(--color-shadow) 4%, transparent),
      0px var(--ni-4) var(--ni-4) 0px
        color-mix(in srgb, var(--color-shadow) 8%, transparent),
      0px var(--ni-1) var(--ni-2) 0px
        color-mix(in srgb, var(--color-shadow) 8%, transparent);
  }
</style>
