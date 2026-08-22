<script lang="ts">
  import ClearData from "./_internal/ClearData.svelte";
  import ExportGateProvider from "./_internal/export-gate/ExportGateProvider.svelte";
  import DeleteAccount from "./_internal/DeleteAccount.svelte";
  import HistoryAnalysis from "./_internal/HistoryAnalysis.svelte";
</script>

<ExportGateProvider>
  <div class="trakt-advanced-settings-page">
    <HistoryAnalysis />

    <ClearData />

    <DeleteAccount />
  </div>
</ExportGateProvider>

<style>
  .trakt-advanced-settings-page {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
