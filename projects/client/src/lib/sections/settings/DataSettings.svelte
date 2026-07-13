<script lang="ts">
  import ClearData from "./_internal/ClearData.svelte";
  import RawExport from "./_internal/RawExport.svelte";
  import RawImport from "./_internal/RawImport.svelte";
  import SettingsDrawer from "./SettingsDrawer.svelte";
</script>

<div class="trakt-data-settings">
  <SettingsDrawer />
  <RawImport />
  <RawExport />
  <ClearData />
</div>

<style>
  .trakt-data-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
