<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useStreamingServiceNames } from "$lib/components/media/streaming-service/useStreamingServiceNames";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePlexLibrary } from "$lib/features/plex/usePlexLibrary";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { filterGroupedServices } from "./filterGroupedServices";
  import { getGroupedServices } from "./getGroupedServices";
  import { StreamingGroup } from "./models/StreamingGroup";
  import { useAllStreamOn } from "./useAllStreamOn";
  import WhereToWatchCategory from "./WhereToWatchCategory.svelte";
  import WhereToWatchItem from "./WhereToWatchItem.svelte";
  import WhereToWatchServiceSection from "./WhereToWatchServiceSection.svelte";

  const {
    onClose,
    ...target
  }: MetaInfoProps & {
    onClose: () => void;
  } = $props();

  const { list, isLoading } = $derived(useAllStreamOn(target));
  const { plexServices } = $derived(usePlexLibrary(target));

  const { country, favorites } = useStreamingPreferences();
  const serviceNames = useStreamingServiceNames();

  let searchTerm = $state("");
  const normalizedSearchTerm = $derived(searchTerm.trim().toLocaleLowerCase());
  const isSearching = $derived(normalizedSearchTerm.length > 0);

  const groupedList = $derived(
    getGroupedServices({
      services: $list,
      userCountry: $country,
      favoriteSources: $favorites,
    }),
  );

  const visibleList = $derived(
    isSearching
      ? filterGroupedServices({
        grouped: groupedList,
        term: normalizedSearchTerm,
        names: $serviceNames,
      })
      : groupedList,
  );

  const groupLabels: Record<StreamingGroup, string> = {
    [StreamingGroup.Favorite]: m.list_title_streaming_favorite(),
    [StreamingGroup.Subscription]: m.list_title_streaming_subscription(),
    [StreamingGroup.Free]: m.list_title_streaming_free(),
    [StreamingGroup.Purchase]: m.list_title_streaming_purchase(),
    [StreamingGroup.Rent]: m.list_title_streaming_rent(),
  };

  const hasStreamingResults = $derived(
    Object.values(visibleList).some((rows) => rows.length > 0),
  );

  const hasAnyResults = $derived(
    ($plexServices.length > 0 && !isSearching) || hasStreamingResults,
  );

</script>

<Drawer {onClose} title={m.list_title_where_to_watch()} size="large">
  <label class="where-to-watch-search">
    <SearchIcon />
    <input
      bind:value={searchTerm}
      type="search"
      aria-label={m.input_label_search_streaming_services()}
      placeholder={m.input_placeholder_search_streaming_services()}
    />
  </label>

  <RenderFor audience="authenticated" device={["mobile"]}>
    {#if $plexServices.length > 0 && !isSearching}
      <WhereToWatchCategory>
        <SectionList
          id={{
            scope: `where-to-watch-drawer-list-library`,
            key: target.media.slug,
          }}
          items={$plexServices}
          title={null}
          variant="inline"
          --height-list="var(--height-where-to-watch-list)"
        >
          {#snippet item(entry)}
            <WhereToWatchItem service={entry} country={$country} />
          {/snippet}
        </SectionList>
      </WhereToWatchCategory>
    {/if}
  </RenderFor>

  <div class="trakt-where-to-watch-categories">
    {#each Object.entries(visibleList) as [group, rows] (group)}
      {#if rows.length > 0}
        {@const streamingGroup = group as StreamingGroup}
        {@const label = groupLabels[streamingGroup]}
        <WhereToWatchCategory title={label}>
          {#each rows as row (row.key)}
            <WhereToWatchServiceSection
              source={row.source}
              countries={row.countries}
              group={streamingGroup}
              {isSearching}
            />
          {/each}
        </WhereToWatchCategory>
      {/if}
    {/each}
  </div>

  {#if $isLoading}
    <LoadingIndicator />
  {/if}

  {#if !$isLoading && !hasAnyResults}
    <p class="secondary">
      {isSearching
        ? m.list_placeholder_no_filter_results()
        : m.button_text_no_services()}
    </p>
  {/if}
</Drawer>

<style lang="scss">
  .where-to-watch-search {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    margin-block-start: var(--ni-4);
    margin-block-end: var(--gap-s);
    min-height: var(--ni-48);
    padding: 0 var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-l);
    background: var(--color-input-background);
    outline: var(--border-thickness-xxs) solid var(--color-border);

    transition: outline var(--transition-increment) ease-in-out;

    &:focus-within {
      outline: var(--border-thickness-xs) solid var(--purple-500);
    }

    :global(svg) {
      flex-shrink: 0;
      width: var(--ni-24);
      height: var(--ni-24);
      color: var(--color-text-secondary);
    }

    input {
      all: unset;
      min-width: 0;
      width: 100%;
      height: 100%;
    }
  }

  .trakt-where-to-watch-categories {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>

