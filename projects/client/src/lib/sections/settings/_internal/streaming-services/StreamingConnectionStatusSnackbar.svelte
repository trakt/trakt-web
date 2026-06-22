<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
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
          title: `✅ ${m.text_connection_status_connected_title({
            service: serviceName,
          })}`,
          message: m.text_connection_status_connected_message(),
        };
      case "error":
        return {
          title: `⚠️ ${m.text_connection_status_error_title({ service: serviceName })}`,
          message: m.text_connection_status_error_message(),
          variant: "error" as const,
        };
      case "cancelled":
        return {
          title: `👋 ${m.text_connection_status_cancelled_title()}`,
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

{#if content}
  <Snackbar
    open={$streamingConnectionStatus !== null}
    onDismiss={dismiss}
    title={content.title}
    message={content.message}
    variant={content.variant}
  />
{/if}
