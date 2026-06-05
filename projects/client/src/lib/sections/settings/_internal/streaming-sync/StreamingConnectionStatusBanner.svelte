<script lang="ts">
  import AutoCloseButton from "$lib/components/buttons/AutoCloseButton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { streamingConnectionStatus } from "./streamingConnectionStatus.ts";
  import { useStreamingServiceLookup } from "./useStreamingServiceLookup.ts";

  const { lookup } = useStreamingServiceLookup();

  const serviceName = $derived.by(() => {
    const status = $streamingConnectionStatus;
    if (!status?.serviceId) {
      return m.text_streaming_service_fallback();
    }
    return $lookup?.get(status.serviceId)?.name ?? status.serviceId;
  });

  const content = $derived.by(() => {
    const status = $streamingConnectionStatus;
    if (!status) {
      return undefined;
    }

    switch (status.kind) {
      case "connected":
        return {
          icon: "✅",
          title: m.text_connection_status_connected_title({
            service: serviceName,
          }),
          message: m.text_connection_status_connected_message(),
        };
      case "error":
        return {
          icon: "⚠️",
          title: m.text_connection_status_error_title({ service: serviceName }),
          message: m.text_connection_status_error_message(),
        };
      case "cancelled":
        return {
          icon: "👋",
          title: m.text_connection_status_cancelled_title(),
          message: m.text_connection_status_cancelled_message({
            service: serviceName,
          }),
        };
    }
  });

  function dismiss() {
    streamingConnectionStatus.set(null);
  }
</script>

{#if $streamingConnectionStatus && content}
  <div
    class="trakt-connection-status"
    data-kind={$streamingConnectionStatus.kind}
    role="status"
    aria-live="polite"
  >
    <span class="status-icon" aria-hidden="true">{content.icon}</span>
    <div class="status-text">
      <p class="status-line bold">{content.title}</p>
      <p class="status-line subtle">{content.message}</p>
    </div>
    <AutoCloseButton
      onclick={dismiss}
      label={m.button_label_close()}
      durationMs={10000}
    />
  </div>
{/if}

<style lang="scss">
  .trakt-connection-status {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--ni-16) var(--ni-20);
    border-radius: var(--border-radius-l);

    background-color: var(--color-card-background);
    box-shadow: var(--shadow-base);

    // No semantic green token exists; --green-500 matches existing success use.
    &[data-kind="connected"] {
      --tint: var(--green-500);
    }

    &[data-kind="error"] {
      --tint: var(--color-foreground-red);
    }

    &[data-kind="cancelled"] {
      --tint: var(--color-link-active);
    }

    &[data-kind] {
      background-image: linear-gradient(
        120deg,
        color-mix(in srgb, var(--tint) 22%, var(--color-card-background)) 0%,
        var(--color-card-background) 60%
      );
    }
  }

  .status-icon {
    flex-shrink: 0;

    font-size: var(--ni-28);
    line-height: 1;
  }

  .status-text {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
  }

  .status-line {
    margin: 0;
  }

  .status-line.subtle {
    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
  }
</style>
