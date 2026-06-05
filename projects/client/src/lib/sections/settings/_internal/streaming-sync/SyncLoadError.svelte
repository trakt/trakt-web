<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { onRetry }: { onRetry?: () => void } = $props();
</script>

<div class="trakt-sync-load-error" role="alert">
  <p class="secondary">{m.error_text_sync_load_failed()}</p>
  {#if onRetry}
    <Button
      size="small"
      variant="secondary"
      color="default"
      label={m.button_text_retry()}
      onclick={onRetry}
    >
      {m.button_text_retry()}
    </Button>
  {/if}
</div>

<style>
  .trakt-sync-load-error {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-s);

    padding: var(--ni-16) var(--ni-20);
    border-radius: var(--border-radius-l);
    background-color: var(--color-card-background);
  }
</style>
