<script lang="ts">
  import EpisodeTypeToggles from "$lib/features/calendar/EpisodeTypeToggles.svelte";
  import CalendarItem from "$lib/features/calendar/CalendarItem.svelte";
  import { useEpisodeType } from "$lib/features/calendar/useEpisodeType";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { FilterParams } from "$lib/requests/models/FilterParams";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CtaItem from "./components/cta/CtaItem.svelte";
  import DrillableMediaList from "./drilldown/DrillableMediaList.svelte";
  import { useUpcomingItems } from "./stores/useUpcomingItems";

  const { mode } = useDiscover();

  const { filterMap } = useFilter();

  const { episodeType, current, isApplicable } = useEpisodeType();

  const useList = (
    props: { type: DiscoverMode; limit: number } & FilterParams,
  ) => useUpcomingItems({ ...props, episodeType });

  const cta = $derived({
    type: "upcoming" as const,
    mediaType: $mode === "media" ? undefined : $mode,
  });
</script>

{#snippet metaInfo()}
  {#if $isApplicable}
    <ListMetaInfo text={$current.text()} />
  {/if}
{/snippet}

<DrillableMediaList
  id={{
    scope: "upcoming-list",
  }}
  source={{ id: "calendar" }}
  type={$mode}
  variant="landscape"
  filter={$filterMap}
  {useList}
  {metaInfo}
  urlBuilder={UrlBuilder.calendar}
  drilldownLabel={m.button_label_calendar()}
  title={m.list_title_upcoming_schedule()}
>
  {#snippet item(entry)}
    <CalendarItem item={entry} />
  {/snippet}

  {#snippet actions()}
    <EpisodeTypeToggles />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}
</DrillableMediaList>
