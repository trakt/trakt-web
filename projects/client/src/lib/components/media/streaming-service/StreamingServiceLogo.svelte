<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useStreamingServices } from "$lib/stores/useStreamingServices";
  import type { StreamingServiceLogoIntl } from "./StreamingServiceLogoIntl";

  type StreamingServiceLogoProps = {
    source: string;
    i18n: StreamingServiceLogoIntl;
  };

  const { source, i18n }: StreamingServiceLogoProps = $props();
  const { sources } = useStreamingServices();

  const service = $derived($sources.find((s) => s.source === source));
  const displayName = $derived(service?.name ?? "");

  /*
    TODO:
    - 4k tag
  */
</script>

<div class="trakt-streaming-service-logo">
  <CrossOriginImage src={service?.logoUrl ?? ""} alt={i18n.alt(displayName)} />
</div>

<style>
  .trakt-streaming-service-logo {
    display: flex;
    align-items: center;

    :global(img) {
      width: var(--ni-36);
      height: auto;
    }
  }
</style>
