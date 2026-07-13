<script lang="ts">
  import DeleteAccount from "./_internal/DeleteAccount.svelte";
  import HistoryAnalysis from "./_internal/HistoryAnalysis.svelte";
</script>

<div class="trakt-advanced-settings-page">
  <HistoryAnalysis />

  <DeleteAccount />
</div>

<style>
  .trakt-advanced-settings-page {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
