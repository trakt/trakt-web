<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useStreamingServices } from "$lib/stores/useStreamingServices";
  import ServiceLogo from "./_internal/ServiceLogo.svelte";
  import type { StreamingServiceLogoIntl } from "./StreamingServiceLogoIntl";

  type StreamingServiceLogoProps = {
    source: string;
    country: string;
    i18n: StreamingServiceLogoIntl;
  };

  const { source, i18n, country }: StreamingServiceLogoProps = $props();

  const { sources } = $derived(useStreamingServices(country));

  const service = $derived($sources.find((s) => s.source === source));
  const displayName = $derived(service?.name ?? "");

  /*
    TODO:
    - 4k tag
  */
</script>

<div
  class="trakt-streaming-service-logo"
  class:has-channel-logo={!!service?.channelLogoUrl}
  style="--logo-color: {service?.color ?? 'var(--color-text-primary)'};"
>
  {#if service?.logoUrl}
    <ServiceLogo
      source={service.source}
      logoSrc={service.logoUrl}
      {displayName}
      {i18n}
    />
    {#if service?.channelLogoUrl}
      <div class="trakt-channel-separator"></div>
      <CrossOriginImage
        src={service?.channelLogoUrl}
        alt={i18n.alt(displayName)}
        classList="trakt-channel-logo"
      />
    {/if}
  {:else}
    <span class="bold uppercase">{displayName}</span>
  {/if}
</div>

<style>
  .trakt-streaming-service-logo {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    :global(img),
    :global(svg) {
      width: var(--ni-36);
      height: auto;
    }

    .trakt-channel-separator {
      width: var(--ni-1);
      height: var(--ni-12);

      background-color: var(--color-text-primary);
    }
  }
</style>
