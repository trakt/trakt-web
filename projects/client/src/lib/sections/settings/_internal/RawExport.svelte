<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import NavigationGuard from "$lib/components/NavigationGuard.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useAnalytics } from "$lib/features/analytics/useAnalytics";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { runRawExport } from "../export/runRawExport.ts";
  import { createExportProgressState } from "./export-progress/createExportProgressState.ts";
  import ExportProgressSnackbar from "./export-progress/ExportProgressSnackbar.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import SettingsSection from "./SettingsSection.svelte";

  const { user } = useUser();
  const { record } = useAnalytics();

  const state = $state(createExportProgressState());

  let abortController: AbortController | null = null;

  const reset = () => Object.assign(state, createExportProgressState());

  function stopExport() {
    abortController?.abort();
    reset();
  }

  async function startExport() {
    if (!$user) return;

    const startTime = Date.now();
    reset();
    state.isExporting = true;
    let failedCount = 0;

    record(AnalyticsEvent.ExportInitiated, {});

    abortController = new AbortController();

    await runRawExport({
      user: { slug: $user.slug, isVip: $user.isVip },
      signal: abortController.signal,
      onStatus: (status) => {
        if (status.type === "partial") {
          failedCount = status.failed;
        }

        state.status = status;
      },
      onProgress: ({ processed, total, page }) => {
        state.processed = processed;
        state.total = total;
        state.page = page ?? 0;
      },
      onComplete: () => {
        const exportDuration = Date.now() - startTime;
        record(AnalyticsEvent.ExportCompleted, {
          duration: exportDuration,
          endpointCount: state.total,
          failedCount,
        });

        state.isExporting = false;

        if (failedCount > 0) {
          return;
        }

        setTimeout(reset, time.seconds(3));
      },
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
        record(AnalyticsEvent.ExportFailed, { error: errorMessage });

        state.hasFailed = true;
        state.isExporting = false;
      },
    });
  }
</script>

<NavigationGuard
  isActive={state.isExporting}
  confirmationParams={{ type: ConfirmationType.CancelExport }}
  onreset={stopExport}
>
  <SettingsSection
    title={m.header_export()}
    description={m.description_export()}
  >
    <SettingsRow title={m.text_raw_export()}>
      <Button
        label={m.button_label_raw_export()}
        disabled={state.isExporting}
        onclick={startExport}
        color="default"
        size="small"
      >
        {m.button_text_raw_export()}
      </Button>
    </SettingsRow>
  </SettingsSection>
</NavigationGuard>

<ExportProgressSnackbar {state} onStop={stopExport} onDismiss={reset} />
