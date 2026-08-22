<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toExportStatusText } from "../../export/toExportStatusText.ts";
  import type { ExportProgressState } from "./ExportProgressState.ts";

  type ExportProgressSnackbarProps = {
    state: ExportProgressState;
    onStop: () => void;
    onDismiss: () => void;
  };

  const { state, onStop, onDismiss }: ExportProgressSnackbarProps = $props();

  const progressText = $derived.by(() => {
    const counts = `${state.processed}/${state.total}`;
    const progress = state.page > 0 ? `(${counts} · ${state.page})` : `(${counts})`;

    return m.text_exporting({ progress });
  });

  const statusText = $derived.by(() => {
    if (state.hasFailed) {
      return m.text_export_status_fail();
    }

    if (!state.status) {
      return "";
    }

    return toExportStatusText({ status: state.status, total: state.total });
  });

  const stopText = $derived(m.button_text_stop_export());
</script>

<Snackbar
  open={state.isExporting || statusText !== ""}
  persistent
  dismissible={!state.isExporting}
  title={m.header_exporting_data()}
  variant={state.hasFailed ? "error" : "default"}
  action={state.isExporting
    ? { text: stopText, label: stopText, onAction: onStop }
    : undefined}
  {onDismiss}
>
  {#if state.isExporting}
    <p>{progressText}</p>
  {/if}

  {#if statusText}
    <p class="small secondary">{statusText}</p>
  {/if}
</Snackbar>
