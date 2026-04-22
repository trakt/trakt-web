<script lang="ts">
  import RawExport from "./_internal/RawExport.svelte";
  import RawImport from "./_internal/RawImport.svelte";
  import ResetData from "./_internal/ResetData.svelte";
  import SettingsDrawer from "./SettingsDrawer.svelte";
</script>

<div class="trakt-data-settings">
  <SettingsDrawer />
  <RawImport />
  <RawExport />
  <ResetData />
</div>

<style>
  .trakt-data-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxl);

    max-width: var(--ni-920);
  }
</style>
