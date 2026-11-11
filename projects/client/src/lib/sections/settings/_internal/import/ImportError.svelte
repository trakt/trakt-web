<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ImportSourceConfig } from "$lib/sections/settings/import/ImportTypes.ts";
  import { slide } from "svelte/transition";
  import ImportReport from "./ImportReport.svelte";

  type ImportErrorProps = {
    config: ImportSourceConfig;
    error: string;
    onreset: () => void;
  };

  const { config, error, onreset }: ImportErrorProps = $props();
</script>

<div class="trakt-import-error" transition:slide={{ duration: 150, axis: "y" }}>
  <p class="secondary">
    {m.import_status_error({ message: error })}
  </p>
  <div class="import-error-actions">
    <Button
      label={m.button_label_cancel()}
      onclick={onreset}
      color="default"
      size="small"
    >
      {m.button_text_cancel()}
    </Button>
  </div>
  <ImportReport {config} attachedFiles={[]} />
</div>

<style>
  .trakt-import-error {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .import-error-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
