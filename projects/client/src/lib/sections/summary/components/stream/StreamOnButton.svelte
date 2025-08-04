<script lang="ts">
  import PlexButton from "$lib/components/buttons/plex/PlexButton.svelte";
  import StreamingServiceButton from "$lib/components/buttons/streaming-service/StreamingServiceButton.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { StreamOnButtonProps } from "./StreamOnButtonProps";
  import { usePlexCollection } from "./_internal/usePlexCollection";

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
  const { isInCollection } = $derived(usePlexCollection(target));
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
  <RenderForFeature flag={FeatureFlag.Plex}>
    {#snippet enabled()}
      {#if $isInCollection}
        <PlexButton {style} {size} {target} />
      {:else}
        {@render streamOnButton()}
      {/if}
    {/snippet}

    {@render streamOnButton()}
  </RenderForFeature>
</RenderFor>
