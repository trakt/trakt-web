<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { slide } from "svelte/transition";

  type ImportErrorProps = {
    error: string;
    onreset: () => void;
  };

  const { error, onreset }: ImportErrorProps = $props();
</script>

<div class="import-error" transition:slide={{ duration: 150, axis: "y" }}>
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
</div>

<style>
  .import-error {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .import-error-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }
</style>
