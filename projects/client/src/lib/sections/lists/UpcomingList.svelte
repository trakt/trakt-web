<script lang="ts">
  import CalendarItem from "$lib/features/calendar/CalendarItem.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CalendarButton from "./components/CalendarButton.svelte";
  import CtaItem from "./components/cta/CtaItem.svelte";
  import DrillableMediaList from "./drilldown/DrillableMediaList.svelte";
  import { useUpcomingItems } from "./stores/useUpcomingItems";

  const { mode } = useDiscover();

  const { filterMap } = useFilter();

  const cta = $derived({
    type: "upcoming" as const,
    mediaType: $mode === "media" ? undefined : $mode,
  });
</script>

<DrillableMediaList
  id="upcoming-list"
  source={{ id: "calendar" }}
  type={$mode}
  variant="landscape"
  filter={$filterMap}
  useList={useUpcomingItems}
  urlBuilder={UrlBuilder.calendar}
  drilldownLabel={m.button_label_calendar()}
  title={m.list_title_upcoming_schedule()}
>
  {#snippet item(entry)}
    <CalendarItem item={entry} />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    <CtaItem {cta} variant="placeholder" />
  {/snippet}

  {#snippet actions()}
    <CalendarButton />
  {/snippet}
</DrillableMediaList>
