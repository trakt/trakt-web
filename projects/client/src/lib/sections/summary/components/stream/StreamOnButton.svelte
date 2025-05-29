<script lang="ts">
  import PlexButton from "$lib/components/buttons/plex/PlexButton.svelte";
  import StreamingServiceButton from "$lib/components/buttons/streaming-service/StreamingServiceButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { StreamOnButtonProps } from "./StreamOnButtonProps";

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

  const hasPlexSlug = $derived(target.media.plexSlug !== undefined);
</script>

{#if isAiredItem}
  <RenderFor audience="authenticated">
    {#if streamOn?.preferred}
      <StreamingServiceButton
        service={streamOn.preferred}
        mediaTitle={target.media.title}
        {style}
        {size}
      />
    {:else if hasPlexSlug}
      <PlexButton {style} {size} {target} />
    {/if}
  </RenderFor>

  <RenderFor audience="director">
    {#if streamOn?.preferred && hasPlexSlug}
      <PlexButton {style} {size} {target} />
    {/if}
  </RenderFor>
{/if}
