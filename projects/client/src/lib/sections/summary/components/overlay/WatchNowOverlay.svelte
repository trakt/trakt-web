<script lang="ts">
  import WatchNowServiceLogo from "$lib/components/buttons/watch-now/_internal/WatchNowServiceLogo.svelte";
  import { WatchNowButtonIntlProvider } from "$lib/components/buttons/watch-now/WatchNowButtonIntlProvider";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { WatchNowStreaming } from "$lib/requests/models/WatchNowServices";

  const {
    service,
  }: {
    service?: WatchNowStreaming;
  } = $props();
</script>

{#if service}
  <div class="trakt-watch-now-overlay">
    <div class="trakt-watch-now-source">
      <h6 class="uppercase">{m.stream_on()}</h6>
      <WatchNowServiceLogo
        source={service.source}
        i18n={WatchNowButtonIntlProvider}
      />
    </div>
    <div class="trakt-watch-now-play">
      <PlayIcon />
    </div>
  </div>
{/if}

<style>
  .trakt-watch-now-overlay {
    --source-shadow: var(--ni-2) var(--ni-2) var(--ni-4)
      var(--color-background-purple);

    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .trakt-watch-now-source {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    text-shadow: var(--source-shadow);
    padding: var(--ni-8);

    :global(.trakt-watch-now-service-logo) {
      filter: drop-shadow(var(--source-shadow));
      height: var(--ni-40);
      width: auto;
    }
  }

  .trakt-watch-now-play {
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
