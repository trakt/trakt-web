<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import VideoPlayer from "$lib/features/player/VideoPlayer.svelte";
  import { usePlexLibrary } from "$lib/features/plex/usePlexLibrary";
  import { usePlexStream } from "$lib/features/plex/usePlexStream";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { hasAired } from "$lib/utils/media/hasAired";
  import { slide } from "svelte/transition";
  import JustWatchInfo from "./_internal/JustWatchInfo.svelte";
  import { mapToServices } from "./_internal/mapToServices";
  import WhereToWatchDrawer from "./_internal/WhereToWatchDrawer.svelte";
  import WhereToWatchItem from "./_internal/WhereToWatchItem.svelte";

  const {
    streamOn,
    variant,
    ...target
  }: MetaInfoProps & {
    streamOn?: StreamOn;
    variant?: ListVariant;
  } = $props();

  const justWatchServices = $derived(mapToServices(streamOn));
  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const { plexServices } = $derived(usePlexLibrary(target));
  const { plexStreamSrc, isLoading } = $derived(
    usePlexStream({
      slug: target.media.slug,
      type: target.type,
    }),
  );

  const services = $derived.by(() => {
    if (!$isMobile) {
      return justWatchServices;
    }

    return [...$plexServices, ...justWatchServices];
  });

  const { country } = useStreamingPreferences();

  const isAired = $derived.by(() => {
    switch (target.type) {
      case "movie":
      case "show":
        return hasAired(target.media);
      case "episode":
        return hasAired(target.episode);
    }
  });
</script>

{#if !$isLoading && $plexStreamSrc}
  <VideoPlayer src={$plexStreamSrc} />
{/if}

{#snippet metaInfo()}
  <JustWatchInfo {...target} rank={streamOn?.services?.streamingRank} />
{/snippet}

{#if isAired}
  <div transition:slide={{ duration: 150 }}>
    <SectionList
      id={`where-to-watch-${target.media.slug}`}
      items={services}
      title={m.list_title_where_to_watch()}
      {metaInfo}
      {variant}
      --height-list="var(--height-where-to-watch-list)"
    >
      {#snippet item(service)}
        <WhereToWatchItem {service} country={$country} />
      {/snippet}

      {#snippet empty()}
        <p class="secondary">{m.button_text_no_services()}</p>
      {/snippet}

      {#snippet actions()}
        <WhereToWatchDrawer {...target} />
      {/snippet}
    </SectionList>
  </div>
{/if}
