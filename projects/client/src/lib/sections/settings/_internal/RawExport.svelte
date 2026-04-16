<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useAnalytics } from "$lib/features/analytics/useAnalytics";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { slide } from "svelte/transition";
  import { runRawExport } from "../export/runRawExport.ts";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";

  const { user } = useUser();
  const { record } = useAnalytics();

  type ExportState = {
    isExporting: boolean;
    statusText: string;
    progress: string;
    endpointCount: number;
  };

  const state = $state<ExportState>({
    isExporting: false,
    statusText: "",
    progress: "",
    endpointCount: 0,
  });

  async function startExport() {
    if (!$user) return;

    const startTime = Date.now();
    state.isExporting = true;
    state.endpointCount = 0;

    record(AnalyticsEvent.ExportInitiated, {
      isVip: $user.isVip ? "true" : "false",
    });

    await runRawExport({
      user: { slug: $user.slug, isVip: $user.isVip },
      onStatus: (status) => {
        switch (status.type) {
          case "complete":
            state.statusText = m.text_export_status_complete();
            break;
          case "zip":
            state.statusText = m.text_export_status_zipping();
            break;
          case "fetch":
            state.statusText = m.text_export_status_fetching({ item: status.item });
            state.endpointCount += 1;
            break;
        }
      },
      onProgress: (msg) => {
        state.progress = msg;
      },
      onComplete: () => {
        const exportDuration = Date.now() - startTime;
        record(AnalyticsEvent.ExportCompleted, {
          duration: exportDuration,
          endpointCount: state.endpointCount,
        });

        setTimeout(() => {
          state.isExporting = false;
          state.statusText = "";
          state.progress = "";
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

<SettingsBlock title={m.header_export()} description={m.description_export()}>
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
          {@render exportLabel(m.text_exporting({ progress: state.progress }))}
        {/if}
        {#if state.statusText}
          {@render exportLabel(state.statusText)}
        {/if}
      </div>
    </div>
  </SettingsRow>
</SettingsBlock>

<style>
  .trakt-raw-export {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
