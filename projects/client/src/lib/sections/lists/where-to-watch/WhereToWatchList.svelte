<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePlexLibrary } from "$lib/features/plex/usePlexLibrary";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import WhereToWatchEmptyItem from "$lib/sections/lists/where-to-watch/_internal/WhereToWatchEmptyItem.svelte";
  import {
    summaryDrawerNavigation,
    SummaryDrawers,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { hasAired } from "$lib/utils/media/hasAired";
  import { slide } from "svelte/transition";
  import JustWatchInfo from "./_internal/JustWatchInfo.svelte";
  import { mapToServices } from "./_internal/mapToServices";
  import WhereToWatchItem from "./_internal/WhereToWatchItem.svelte";

  const {
    streamOn,
    variant,
    ...target
  }: MetaInfoProps & {
    streamOn?: StreamOn;
    variant?: ListVariant;
  } = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const justWatchServices = $derived(mapToServices(streamOn));
  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const { plexServices } = $derived(usePlexLibrary(target));

  const services = $derived.by(() => {
    if (!$isMobile) {
      return justWatchServices;
    }

    return [...$plexServices, ...justWatchServices];
  });

  const drilldown = $derived.by(() =>
    services.length > 0
      ? {
          ...buildDrawerLink(SummaryDrawers.WhereToWatch),
          source: { id: "where-to-watch" },
          label: m.button_label_view_all_where_to_watch(),
        }
      : undefined,
  );

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

{#snippet metaInfo()}
  <JustWatchInfo {...target} rank={streamOn?.services?.streamingRank} />
{/snippet}

{#if isAired}
  <div transition:slide={{ duration: 150 }}>
    <SectionList
      id={`where-to-watch-${target.media.slug}`}
      items={services}
      title={m.list_title_where_to_watch()}
      {drilldown}
      {metaInfo}
      {variant}
      --height-list="var(--height-where-to-watch-list)"
    >
      {#snippet item(service)}
        <WhereToWatchItem {service} country={$country} />
      {/snippet}

      {#snippet empty()}
        <div class="where-to-watch-empty">
          <WhereToWatchEmptyItem />
        </div>
      {/snippet}
    </SectionList>
  </div>
{/if}

<style lang="scss">
  .where-to-watch-empty {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    align-self: flex-start;
    width: fit-content;
    margin-inline: 0;
    padding-inline: 0;
    padding-block: var(--ni-12);
    min-height: var(--height-where-to-watch-list);
  }

  :global(.section-list-empty-state) {
    width: auto;
    margin: 0;
    padding-inline: 0;
    align-items: flex-start;
    justify-content: flex-start;
  }

  :global(.section-list-empty-state:not(:has(:global(.trakt-skeleton-list)))) {
    width: auto;
  }
</style>
