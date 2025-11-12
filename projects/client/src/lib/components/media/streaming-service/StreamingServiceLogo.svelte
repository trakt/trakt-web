<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useStreamingServices } from "$lib/stores/useStreamingServices";
  import type { StreamingServiceLogoIntl } from "./StreamingServiceLogoIntl";

  type StreamingServiceLogoProps = {
    source: string;
    i18n: StreamingServiceLogoIntl;
    variant?: "monochrome" | "colored";
  };

  const {
    source,
    i18n,
    variant = "monochrome",
  }: StreamingServiceLogoProps = $props();
  const { sources } = useStreamingServices();

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
    <CrossOriginImage
      src={service.logoUrl}
      alt={i18n.alt(displayName)}
      classList="trakt-service-logo"
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
    <span class="meta-info uppercase">{displayName}</span>
  {/if}
</div>

<style>
  .trakt-streaming-service-logo {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    &.is-colored {
      :global(img.trakt-service-logo) {
        filter: drop-shadow(0 var(--ni-240) 0 var(--logo-color));
        transform: translateY(var(--ni-neg-240));
      }
    }

    :global(img) {
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
