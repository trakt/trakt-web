<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import ServiceLogo from "./_internal/ServiceLogo.svelte";
  import { useStreamingServiceLogo } from "./_internal/useStreamingServiceLogo";
  import type { StreamingServiceLogoIntl } from "./StreamingServiceLogoIntl";

  type StreamingServiceLogoProps = {
    source: string;
    country: string;
    i18n: StreamingServiceLogoIntl;
  };

  const { source, i18n, country }: StreamingServiceLogoProps = $props();

  const logo = $derived(useStreamingServiceLogo({ country, source }));

  const displayName = $derived($logo?.name || "");
  /*
    TODO:
    - 4k tag
  */
</script>

<div
  class="trakt-streaming-service-logo"
  class:has-channel-logo={!!$logo?.channelUrl}
>
  {#if $logo?.url}
    <ServiceLogo {source} logoSrc={$logo?.url} {displayName} {i18n} />
    {#if $logo?.channelUrl}
      <div class="trakt-channel-separator"></div>
      <CrossOriginImage
        src={$logo?.channelUrl}
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
