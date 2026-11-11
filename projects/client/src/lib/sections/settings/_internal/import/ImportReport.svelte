<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ImportSourceConfig } from "$lib/sections/settings/import/ImportTypes.ts";
  import { slide } from "svelte/transition";
  import ImportReportForm from "./ImportReportForm.svelte";

  const {
    config,
    attachedFiles,
  }: {
    config: ImportSourceConfig;
    attachedFiles: ReadonlyArray<File>;
  } = $props();

  const { track } = useTrack(AnalyticsEvent.IssueReportOpen);
  let isOpen = $state(false);

  function open() {
    isOpen = true;
    track({ kind: "import", source: config.id });
  }
</script>

{#if isOpen}
  <div transition:slide={{ duration: 150, axis: "y" }}>
    <ImportReportForm
      {config}
      {attachedFiles}
      onclose={() => (isOpen = false)}
    />
  </div>
{:else}
  <div class="trakt-import-report">
    <Button
      label={m.button_label_report_import_problem()}
      onclick={open}
      color="default"
      variant="secondary"
      size="small"
    >
      {m.button_text_report_import_problem()}
    </Button>
  </div>
{/if}

<style>
  .trakt-import-report {
    display: flex;
  }
</style>
