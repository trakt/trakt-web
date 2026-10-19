<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const { code, serverName }: { code: string; serverName: string } = $props();
</script>

<div class="trakt-jellyfin-quick-connect">
  <p class="secondary">
    <MessageWithBold
      message={m.description_jellyfin_quick_connect_code({
        server: serverName,
      })}
    />
  </p>
  <div class="code-box">
    <span class="code bold">{code}</span>
  </div>
  <div class="waiting" role="status">
    <LoadingIndicator size="small" />
    <p class="small secondary">{m.text_jellyfin_quick_connect_waiting()}</p>
  </div>
</div>

<style lang="scss">
  .trakt-jellyfin-quick-connect {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    :global(b) {
      color: var(--color-text-primary);
    }
  }

  .code-box {
    display: flex;
    justify-content: center;

    padding: var(--gap-l);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
  }

  .code {
    font-size: calc(2 * var(--font-size-title));
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.2em;
    padding-inline-start: 0.2em;
    user-select: all;
  }

  .waiting {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);
  }
</style>
