<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useAnalytics } from "$lib/features/analytics/useAnalytics";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { slide } from "svelte/transition";
  import type { RawExportFormat } from "../export/RawExportFormat.ts";
  import { runRawExport } from "../export/runRawExport.ts";
  import SettingsRow from "./SettingsRow.svelte";
  import SettingsSection from "./SettingsSection.svelte";

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

  const exportFormats: ReadonlyArray<{
    format: RawExportFormat;
    label: () => string;
  }> = [
    { format: "json", label: m.export_format_json_files },
    { format: "csv", label: m.export_format_csv_files },
  ];

  async function startExport(format: RawExportFormat) {
    if (!$user) return;
    if (state.isExporting) return;

    const startTime = Date.now();
    state.isExporting = true;
    state.endpointCount = 0;

    record(AnalyticsEvent.ExportInitiated, {
      isVip: $user.isVip ? "true" : "false",
      format,
    });

    await runRawExport({
      user: { slug: $user.slug, isVip: $user.isVip },
      format,
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
          format,
        });

        setTimeout(() => {
          state.isExporting = false;
          state.statusText = "";
          state.progress = "";
        }, time.seconds(3));
      },
      onError: (err) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
        record(AnalyticsEvent.ExportFailed, { error: errorMessage, format });

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
      <DropdownList
        label={m.button_label_raw_export()}
        disabled={state.isExporting}
        color="default"
        size="small"
        preferNative
      >
        {m.button_text_raw_export()}
        {#snippet items()}
          {#each exportFormats as option (option.format)}
            <DropdownItem onclick={() => startExport(option.format)}>
              {option.label()}
            </DropdownItem>
          {/each}
        {/snippet}
      </DropdownList>
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
</SettingsSection>

<style>
  .trakt-raw-export {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
