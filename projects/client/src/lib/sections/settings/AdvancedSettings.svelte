<script lang="ts">
  import ClearData from "./_internal/ClearData.svelte";
  import DeleteAccount from "./_internal/DeleteAccount.svelte";
  import HistoryAnalysis from "./_internal/HistoryAnalysis.svelte";
  import RawExport from "./_internal/RawExport.svelte";
</script>

<div class="trakt-advanced-settings-page">
  <HistoryAnalysis />

  <ClearData />

  <!-- FIXME: remove this from here when clearing/deduping forces an export -->
  <RawExport />

  <DeleteAccount />
</div>

<style>
  .trakt-advanced-settings-page {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
