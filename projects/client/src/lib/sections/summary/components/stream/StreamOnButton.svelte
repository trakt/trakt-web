<script lang="ts">
  import PlexButton from "$lib/components/buttons/plex/PlexButton.svelte";
  import StreamingServiceButton from "$lib/components/buttons/streaming-service/StreamingServiceButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { getDeviceType } from "$lib/utils/devices/getDeviceType";
  import type { StreamOnButtonProps } from "./StreamOnButtonProps";
  import { usePlexLibrary } from "./_internal/usePlexLibrary";

  const {
    streamOn,
    style,
    size = "small",
    ...target
  }: StreamOnButtonProps = $props();

  const airDate = $derived(
    target.type === "episode" ? target.episode.airDate : target.media.airDate,
  );
  const isAiredItem = $derived(airDate < new Date());

  const deviceType = $derived(getDeviceType(globalThis.navigator.userAgent));

  const { isInLibrary } = $derived(usePlexLibrary(target));
  const canHandlePlex = $derived(
    deviceType === "tv" || deviceType === "mobile",
  );
</script>

{#snippet streamOnButton()}
  {#if isAiredItem && streamOn?.preferred}
    <StreamingServiceButton
      service={streamOn.preferred}
      mediaTitle={target.media.title}
      {style}
      {size}
    />
  {/if}
{/snippet}

<RenderFor audience="authenticated">
  {#if canHandlePlex && $isInLibrary}
    <PlexButton {style} {size} {target} />
  {:else}
    {@render streamOnButton()}
  {/if}
</RenderFor>
