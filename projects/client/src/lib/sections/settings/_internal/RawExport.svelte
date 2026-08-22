<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useAnalytics } from "$lib/features/analytics/useAnalytics";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { slide } from "svelte/transition";
  import { runRawExport } from "../export/runRawExport.ts";
  import { toExportStatusText } from "../export/toExportStatusText.ts";
  import SettingsRow from "./SettingsRow.svelte";
  import SettingsSection from "./SettingsSection.svelte";

  const { user } = useUser();
  const { record } = useAnalytics();

  type ExportState = {
    isExporting: boolean;
    statusText: string;
    processed: number;
    total: number;
  };

  const state = $state<ExportState>({
    isExporting: false,
    statusText: "",
    processed: 0,
    total: 0,
  });

  const progressText = $derived(
    state.total > 0 ? `(${state.processed}/${state.total})` : "",
  );

  async function startExport() {
    if (!$user) return;

    const startTime = Date.now();
    state.isExporting = true;
    state.statusText = "";
    state.processed = 0;
    state.total = 0;
    let failedCount = 0;

    record(AnalyticsEvent.ExportInitiated, {});

    await runRawExport({
      user: { slug: $user.slug, isVip: $user.isVip },
      onStatus: (status) => {
        if (status.type === "partial") {
          failedCount = status.failed;
        }

        state.statusText = toExportStatusText({ status, total: state.total });
      },
      onProgress: ({ processed, total }) => {
        state.processed = processed;
        state.total = total;
      },
      onComplete: () => {
        const exportDuration = Date.now() - startTime;
        record(AnalyticsEvent.ExportCompleted, {
          duration: exportDuration,
          endpointCount: state.total,
          failedCount,
        });

        if (failedCount > 0) {
          state.isExporting = false;
          return;
        }

        setTimeout(() => {
          state.isExporting = false;
          state.statusText = "";
          state.processed = 0;
          state.total = 0;
        }, time.seconds(3));
      },
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
        record(AnalyticsEvent.ExportFailed, { error: errorMessage });

        state.statusText = m.text_export_status_fail();
        state.isExporting = false;
      },
    });
  }
</script>

{#snippet exportLabel(message: string)}
  <p class="secondary" transition:slide={{ duration: 150, axis: "y" }}>
    {message}
  </p>
{/snippet}

<SettingsSection
  title={m.header_export()}
  description={m.description_export()}
>
  <SettingsRow title={m.text_raw_export()}>
    <div class="trakt-raw-export">
      <Button
        label={m.button_label_raw_export()}
        disabled={state.isExporting}
        onclick={startExport}
        color="default"
        size="small"
      >
        {m.button_text_raw_export()}
      </Button>
      <div>
        {#if state.isExporting}
          {@render exportLabel(m.text_exporting({ progress: progressText }))}
        {/if}
        {#if state.statusText}
          {@render exportLabel(state.statusText)}
        {/if}
      </div>
    </div>
  </SettingsRow>
</SettingsSection>

<style>
  .trakt-raw-export {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
