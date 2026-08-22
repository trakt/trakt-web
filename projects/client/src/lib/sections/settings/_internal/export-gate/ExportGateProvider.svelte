<script lang="ts">
  import NavigationGuard from "$lib/components/NavigationGuard.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useAnalytics } from "$lib/features/analytics/useAnalytics";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import type { Snippet } from "svelte";
  import type { ExportGateResult } from "../../export/models/ExportGateResult.ts";
  import { runExportGate } from "../../export/runExportGate.ts";
  import type { ExportGateContext } from "./ExportGateContext.ts";
  import { createExportGateContext } from "./createExportGateContext.ts";
  import ExportProgressSnackbar from "../export-progress/ExportProgressSnackbar.svelte";
  import { createExportProgressState } from "../export-progress/createExportProgressState.ts";

  const { children }: { children: Snippet } = $props();

  const { confirm } = useConfirm();
  const { record } = useAnalytics();

  const state = $state(createExportProgressState());

  let abortController: AbortController | null = null;

  const reset = () => Object.assign(state, createExportProgressState());

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

  const recordOutcome = (result: ExportGateResult, duration: number) => {
    if (result.outcome === "failed") {
      record(AnalyticsEvent.ExportFailed, { error: result.error });
      return;
    }

    record(AnalyticsEvent.ExportCompleted, {
      duration,
      endpointCount: state.total,
      failedCount: result.outcome === "partial" ? result.failed : 0,
    });
  };

  const run: ExportGateContext["run"] = async ({ shouldExport, user }) => {
    if (!shouldExport || !user) {
      return true;
    }

    if (state.isExporting) {
      return false;
    }

    reset();
    abortController = new AbortController();
    const { signal } = abortController;
    state.isExporting = true;

    const startTime = Date.now();
    record(AnalyticsEvent.ExportInitiated, {});

    const result = await runExportGate({
      user,
      signal,
      onStatus: (status) => {
        state.status = status;
      },
      onProgress: ({ processed, total, page }) => {
        state.processed = processed;
        state.total = total;
        state.page = page ?? 0;
      },
    });

    if (signal.aborted || result.outcome === "aborted") {
      return false;
    }

    state.isExporting = false;
    recordOutcome(result, Date.now() - startTime);

    if (result.outcome === "proceed") {
      reset();
      return true;
    }

    if (result.outcome === "failed") {
      state.hasFailed = true;
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

<ExportProgressSnackbar {state} onStop={stop} onDismiss={reset} />
