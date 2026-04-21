<script lang="ts">
  import { reportDialogStore } from "./_internal/reportDialogStore";
  import ReportDialog from "./ReportDialog.svelte";
</script>

{#if $reportDialogStore}
  <ReportDialog
    params={$reportDialogStore}
    onClose={reportDialogStore.close}
  />
{/if}
