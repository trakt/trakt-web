<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExportGateState } from "./ExportGateState.ts";

  type ExportGateSnackbarProps = {
    state: ExportGateState;
    onStop: () => void;
    onDismiss: () => void;
  };

  const { state, onStop, onDismiss }: ExportGateSnackbarProps = $props();

  const message = $derived.by(() => {
    if (!state.isExporting || state.total === 0) {
      return state.statusText;
    }

    const counts = { processed: state.processed, total: state.total };

    return state.page > 0
      ? m.export_status_exporting_page({ ...counts, page: state.page })
      : m.export_status_exporting(counts);
  });

  const stopText = $derived(m.button_text_stop_export());
</script>

<Snackbar
  open={state.isExporting || state.statusText !== ""}
  persistent
  dismissible={!state.isExporting}
  title={m.header_exporting_data()}
  {message}
  variant={state.hasFailed ? "error" : "default"}
  action={state.isExporting
    ? { text: stopText, label: stopText, onAction: onStop }
    : undefined}
  {onDismiss}
/>
