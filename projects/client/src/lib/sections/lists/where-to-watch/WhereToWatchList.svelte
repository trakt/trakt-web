<script lang="ts">
  import type { ListDrilldownProps } from "$lib/components/lists/section-list/models/ListDrilldownProps";
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePlexLibrary } from "$lib/features/plex/usePlexLibrary";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { hasAired } from "$lib/utils/media/hasAired";
  import { slide } from "svelte/transition";
  import JustWatchInfo from "./_internal/JustWatchInfo.svelte";
  import { mapToServices } from "./_internal/mapToServices";
  import { whereToWatchListScope } from "./_internal/whereToWatchListScope.ts";
  import WhereToWatchItem from "./_internal/WhereToWatchItem.svelte";
  import WhereToWatchSkeletonItems from "./_internal/WhereToWatchSkeletonItems.svelte";

  const {
    streamOn,
    variant,
    onDrilldown,
    isLoading = false,
    ...target
  }: MetaInfoProps & {
    streamOn?: StreamOn;
    variant?: ListVariant;
    onDrilldown?: () => void;
    isLoading?: boolean;
  } = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();

  const drilldown = $derived.by<ListDrilldownProps>(() => {
    const shared = {
      source: { id: "where-to-watch" },
      label: m.button_label_view_all_where_to_watch(),
      mode: "always",
    } as const;

    if (onDrilldown) {
      return { ...shared, onClick: onDrilldown };
    }

    return { ...shared, ...buildDrawerLink(SummaryDrawers.WhereToWatch) };
  });
  const justWatchServices = $derived(mapToServices(streamOn));
  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const { plexServices } = $derived(usePlexLibrary(target));

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

{#snippet metaInfo()}
  <JustWatchInfo {...target} rank={streamOn?.services?.streamingRank} />
{/snippet}

{#if isAired}
  <div transition:slide={{ duration: 150 }} class="trakt-where-to-watch-list">
    <SectionList
      id={{
        scope: whereToWatchListScope(target.type),
        key: target.media.slug,
      }}
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
        {#if isLoading}
          <WhereToWatchSkeletonItems />
        {:else}
          <p class="secondary">{m.button_text_no_services()}</p>
        {/if}
      {/snippet}
    </SectionList>
  </div>
{/if}

<style>
  .trakt-where-to-watch-list {
    /* The default is overridden because the meta info has an icon and needs a bigger gap */
    :global(.trakt-list-title) {
      gap: var(--gap-xs);
    }
  }
</style>
