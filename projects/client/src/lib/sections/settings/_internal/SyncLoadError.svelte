<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SyncLoadErrorProps } from "./SyncLoadErrorProps.ts";

  const {
    message = m.error_text_sync_load_failed(),
    hint,
    variant = "card",
    onRetry,
  }: SyncLoadErrorProps = $props();
</script>

<div class="trakt-sync-load-error" data-variant={variant} role="alert">
  <div class="error-copy">
    <p class="bold error-message">{message}</p>
    {#if hint}
      <p class="secondary">{hint}</p>
    {/if}
  </div>
  {#if onRetry}
    <Button
      size="small"
      variant="secondary"
      color="default"
      label={m.button_label_retry()}
      onclick={onRetry}
    >
      {m.button_text_retry()}
    </Button>
  {/if}
</div>

<style>
  .trakt-sync-load-error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--gap-s);

    padding: var(--ni-16) var(--ni-20);
  }

  .trakt-sync-load-error[data-variant="card"] {
    border-radius: var(--border-radius-l);
    background-color: var(--color-card-background);
  }

  .trakt-sync-load-error .error-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .trakt-sync-load-error .error-message {
    color: var(--red-500);
  }
</style>
