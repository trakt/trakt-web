<script lang="ts">
  import EpisodeTypeToggles from "$lib/features/calendar/EpisodeTypeToggles.svelte";
  import ReleasesCalendarItem from "$lib/features/calendar/ReleasesCalendarItem.svelte";
  import { useEpisodeType } from "$lib/features/calendar/useEpisodeType";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { FilterParams } from "$lib/requests/models/FilterParams";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import EpisodeTypeMetaInfo from "./components/EpisodeTypeMetaInfo.svelte";
  import DrillableMediaList from "./drilldown/DrillableMediaList.svelte";
  import { useReleasesItems } from "./stores/useReleasesItems";

  const { mode } = useDiscover();
  const { filterMap } = useFilter();

  const { episodeType } = useEpisodeType();

  const useList = (
    props: { type: DiscoverMode; limit: number } & FilterParams,
  ) => useReleasesItems({ ...props, episodeType });
</script>

{#snippet metaInfo()}
  <EpisodeTypeMetaInfo />
{/snippet}

<DrillableMediaList
  id={{
    scope: "releases-list",
    key: $mode,
  }}
  source={{ id: "releases", type: $mode }}
  type={$mode}
  variant="landscape"
  filter={$filterMap}
  {useList}
  {metaInfo}
  urlBuilder={({ type }) => UrlBuilder.releases({ mode: type })}
  drilldownLabel={m.button_label_view_releases()}
  title={m.list_title_releases()}
>
  {#snippet item(entry)}
    <ReleasesCalendarItem item={entry} />
  {/snippet}

  {#snippet actions()}
    <EpisodeTypeToggles />
  {/snippet}
</DrillableMediaList>
