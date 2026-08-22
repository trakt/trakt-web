<script lang="ts">
  import NavigationGuard from "$lib/components/NavigationGuard.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import { runExportGate } from "../../export/runExportGate.ts";
  import { toExportStatusText } from "../../export/toExportStatusText.ts";
  import type { ExportGateContext } from "./ExportGateContext.ts";
  import { createExportGateContext } from "./createExportGateContext.ts";
  import ExportGateSnackbar from "./ExportGateSnackbar.svelte";
  import type { ExportGateState } from "./ExportGateState.ts";

  const { children }: { children: Snippet } = $props();

  const { confirm } = useConfirm();

  const state = $state<ExportGateState>({
    isExporting: false,
    processed: 0,
    total: 0,
    statusText: "",
    hasFailed: false,
  });

  let abortController: AbortController | null = null;

  const reset = () => {
    state.isExporting = false;
    state.processed = 0;
    state.total = 0;
    state.statusText = "";
    state.hasFailed = false;
  };

  const stop = () => {
    abortController?.abort();
    reset();
  };

  const confirmProceed = (counts: { failed: number; total: number }) =>
    new Promise<boolean>((resolve) => {
      confirm({
        type: ConfirmationType.ProceedAfterPartialExport,
        failed: counts.failed,
        total: counts.total,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      })();
    });

  const run: ExportGateContext["run"] = async ({ shouldExport, user }) => {
    if (!shouldExport || !user) {
      return true;
    }

    reset();
    abortController = new AbortController();
    const { signal } = abortController;
    state.isExporting = true;

    const result = await runExportGate({
      user,
      signal,
      onStatus: (status) => {
        state.statusText = toExportStatusText({ status, total: state.total });
      },
      onProgress: ({ processed, total }) => {
        state.processed = processed;
        state.total = total;
      },
    });

    if (signal.aborted) {
      return false;
    }

    state.isExporting = false;

    if (result.outcome === "proceed") {
      reset();
      return true;
    }

    if (result.outcome === "failed") {
      state.hasFailed = true;
      state.statusText = m.text_export_status_fail();
      return false;
    }

    if (result.outcome === "aborted") {
      return false;
    }

    const shouldProceed = await confirmProceed({
      failed: result.failed,
      total: result.total,
    });

    if (shouldProceed) {
      reset();
    }

    return shouldProceed;
  };

  createExportGateContext({ run, stop });
</script>

<NavigationGuard
  isActive={state.isExporting}
  confirmationParams={{ type: ConfirmationType.CancelExport }}
  onreset={stop}
>
  {@render children()}
</NavigationGuard>

<ExportGateSnackbar {state} onStop={stop} onDismiss={reset} />
