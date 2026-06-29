<script lang="ts">
  import ReleasesCalendarItem from "$lib/features/calendar/ReleasesCalendarItem.svelte";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "./drilldown/DrillableMediaList.svelte";
  import { useReleasesItems } from "./stores/useReleasesItems";

  const { mode } = useDiscover();
  const { filterMap } = useFilter();
</script>

<DrillableMediaList
  id={{
    scope: "releases-list",
    key: $mode,
  }}
  source={{ id: "releases", type: $mode }}
  type={$mode}
  variant="landscape"
  filter={$filterMap}
  useList={useReleasesItems}
  urlBuilder={({ type }) => UrlBuilder.releases({ mode: type })}
  drilldownLabel={m.button_label_view_releases()}
  title={m.list_title_releases()}
>
  {#snippet item(entry)}
    <ReleasesCalendarItem item={entry} />
  {/snippet}
</DrillableMediaList>
