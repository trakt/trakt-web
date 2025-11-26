<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import CalendarItem from "$lib/features/calendar/CalendarItem.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CalendarButton from "./components/CalendarButton.svelte";
  import CtaItem from "./components/cta/CtaItem.svelte";
  import ViewAllCard from "./components/ViewAllCard.svelte";
  import { useIsLimitedList } from "./stores/useIsLimitedList";
  import { useUpcomingItems } from "./stores/useUpcomingItems";
  import { mediaCardWidthResolver } from "./utils/mediaCardWidthResolver";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { mode } = useDiscover();

  const { filterMap } = useFilter();

  const { upcoming, isLoading } = $derived(
    useUpcomingItems({ type: $mode, filter: $filterMap }),
  );

  const cta = $derived({
    type: "upcoming" as const,
    mediaType: $mode === "media" ? undefined : $mode,
  });

  const variant = "landscape";

  const itemWidth = $derived(useVarToPixels(mediaCardWidthResolver(variant)));
  const isLimitedList = useIsLimitedList();
</script>

{#snippet actionCard()}
  <ViewAllCard {variant} href={UrlBuilder.calendar()} />
{/snippet}

<SectionList
  id="upcoming-list"
  items={$upcoming}
  title={m.list_title_upcoming_schedule()}
  --height-list={mediaListHeightResolver(variant)}
  drilldownLink={UrlBuilder.calendar()}
  variant={$isLimitedList
    ? { type: "limit", itemWidth: $itemWidth, actionCard }
    : undefined}
>
  {#snippet item(entry)}
    <CalendarItem item={entry} />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem {cta} variant="card" />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <CtaItem {cta} variant="placeholder" />
    {/if}
  {/snippet}

  {#snippet actions()}
    <CalendarButton />
  {/snippet}
</SectionList>
