<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePlexLibrary } from "$lib/features/plex/usePlexLibrary";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { getGroupedServices } from "./getGroupedServices";
  import type { CostType } from "./getMediaCost";
  import { StreamingGroup } from "./models/StreamingGroup";
  import { useAllStreamOn } from "./useAllStreamOn";
  import WhereToWatchCategory from "./WhereToWatchCategory.svelte";
  import WhereToWatchItem from "./WhereToWatchItem.svelte";
  import WhereToWatchLogo from "./WhereToWatchLogo.svelte";

  const { ...target }: MetaInfoProps = $props();

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const { list, isLoading } = $derived(useAllStreamOn(target));
  const { plexServices } = $derived(usePlexLibrary(target));

  const { country, favorites } = useStreamingPreferences();

  const groupedList = $derived(
    getGroupedServices({
      services: $list,
      userCountry: $country,
      favoriteSources: $favorites,
    }),
  );

  const groupLabels: Record<StreamingGroup, string> = {
    [StreamingGroup.Favorite]: m.list_title_streaming_favorite(),
    [StreamingGroup.Subscription]: m.list_title_streaming_subscription(),
    [StreamingGroup.Free]: m.list_title_streaming_free(),
    [StreamingGroup.Purchase]: m.list_title_streaming_purchase(),
    [StreamingGroup.Rent]: m.list_title_streaming_rent(),
  };

  const hasAnyResults = $derived(
    $plexServices.length > 0 ||
      Object.values(groupedList).some((rows) => rows.length > 0),
  );

  const getCostType = (group: StreamingGroup): CostType => {
    switch (group) {
      case StreamingGroup.Rent:
        return "rent";
      case StreamingGroup.Purchase:
        return "purchase";
      default:
        return "any";
    }
  };
</script>

<ActionButton
  label={m.button_label_view_all_where_to_watch()}
  onclick={() => isOpen.set(!$isOpen)}
  style="ghost"
>
  <CaretRightIcon />
</ActionButton>

{#if $isOpen}
  <Drawer {onClose} title={m.list_title_where_to_watch()} size="large">
    <RenderFor audience="authenticated" device={["mobile"]}>
      {#if $plexServices.length > 0}
        <WhereToWatchCategory>
          <SectionList
            id={`where-to-watch-${target.media.slug}-library`}
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

    {#each Object.entries(groupedList) as [group, rows] (group)}
      {#if rows.length > 0}
        {@const streamingGroup = group as StreamingGroup}
        {@const label = groupLabels[streamingGroup]}
        <WhereToWatchCategory title={label}>
          {#each rows as row (row.key)}
            <div class="trakt-service-row">
              <div class="trakt-service-logo-card">
                <WhereToWatchLogo source={row.source} />
              </div>

              <div class="trakt-service-countries">
                <SectionList
                  id={`where-to-watch-${target.media.slug}-${streamingGroup}-${row.source}`}
                  items={row.countries}
                  title={null}
                  variant="inline"
                  --height-list="var(--height-where-to-watch-list)"
                >
                  {#snippet item(entry)}
                    <WhereToWatchItem
                      service={entry.service}
                      country={entry.country}
                      countryName={entry.countryName}
                      variant="country"
                      type={getCostType(streamingGroup)}
                    />
                  {/snippet}
                </SectionList>
              </div>
            </div>
          {/each}
        </WhereToWatchCategory>
      {/if}
    {/each}

    {#if $isLoading}
      <LoadingIndicator />
    {/if}

    {#if !$isLoading && !hasAnyResults}
      <p class="secondary">{m.button_text_no_services()}</p>
    {/if}
  </Drawer>
{/if}

<style lang="scss">
  .trakt-service-row {
    display: flex;
    gap: var(--gap-s);
  }

  .trakt-service-logo-card {
    margin-top: var(--ni-2);

    flex-shrink: 0;
    width: var(--ni-96);
    height: var(--ni-96);

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: var(--border-radius-m);
    border: var(--ni-1) solid var(--color-border);
  }

  .trakt-service-countries {
    flex: 1;
    min-width: 0;
    align-self: center;
    height: var(--height-where-to-watch-list);
  }
</style>
