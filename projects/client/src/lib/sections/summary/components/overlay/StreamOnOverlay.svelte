<script lang="ts">
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import * as m from "$lib/features/i18n/messages";
  import type { StreamNow } from "$lib/requests/models/StreamingServiceOptions";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";

  const {
    service,
  }: {
    service?: StreamNow;
  } = $props();

  const { country } = useStreamingPreferences();
</script>

{#if service}
  <div class="trakt-stream-on-overlay">
    <div class="trakt-stream-on-source">
      <h6 class="uppercase">{m.header_stream_on()}</h6>
      <StreamingServiceLogo
        source={service.source}
        country={$country}
        i18n={StreamingServiceLogoIntlProvider}
      />
    </div>
    <div class="trakt-stream-on-play">
      <PlayIcon />
    </div>
  </div>
{/if}

<style>
  .trakt-stream-on-overlay {
    --source-shadow: var(--ni-2) var(--ni-2) var(--ni-4)
      var(--color-background-purple);

    color: var(--color-overlay-foreground);

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 0) 20%,
        rgba(0, 0, 0, 0) 100%
      );
    }
  }

  .trakt-stream-on-source {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    text-shadow: var(--source-shadow);
    padding: var(--ni-8);

    :global(.trakt-stream-on-service-logo img) {
      filter: drop-shadow(var(--source-shadow));
      height: var(--ni-40);
      width: auto;
    }
  }

  .trakt-stream-on-play {
    border-radius: 50%;
    background-color: var(--color-background-purple);
    padding: var(--ni-16);
    width: var(--ni-56);
    height: var(--ni-56);

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
