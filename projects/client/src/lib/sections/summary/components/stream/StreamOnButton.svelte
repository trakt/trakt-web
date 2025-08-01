<script lang="ts">
  import PlexButton from "$lib/components/buttons/plex/PlexButton.svelte";
  import StreamingServiceButton from "$lib/components/buttons/streaming-service/StreamingServiceButton.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
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

  const { plexCollection } = useUser();
  const hasPlexSlug = $derived(target.media.plexSlug !== undefined);
  const isInCollection = $derived(
    (target.type === "movie" &&
      $plexCollection.movieIds.includes(target.media.id)) ||
      (target.type === "episode" &&
        $plexCollection.episodeIds.includes(target.episode.id)),
  );
</script>

{#if isAiredItem && streamOn?.preferred}
  <RenderFor audience="authenticated">
    <StreamingServiceButton
      service={streamOn.preferred}
      mediaTitle={target.media.title}
      {style}
      {size}
    />
  </RenderFor>
{/if}

<!-- TODO relocate -->
{#if isInCollection && hasPlexSlug}
  <RenderFor audience="authenticated">
    <PlexButton {style} {size} {target} />
  </RenderFor>
{/if}
