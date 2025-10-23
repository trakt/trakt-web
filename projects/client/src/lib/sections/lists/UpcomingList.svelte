<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import CalendarItem from "$lib/features/calendar/CalendarItem.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CalendarButton from "./components/CalendarButton.svelte";
  import CtaItem from "./components/cta/CtaItem.svelte";
  import { useUpcomingItems } from "./stores/useUpcomingItems";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  const { mode } = useDiscover();

  const { isEnabled } = $derived(useFeatureFlag(FeatureFlag.Discover));

  const { upcoming, isLoading } = $derived(
    useUpcomingItems($isEnabled ? $mode : "media"),
  );
</script>

<SectionList
  id="upcoming-list"
  items={$upcoming}
  title={m.list_title_upcoming_schedule()}
  --height-list={mediaListHeightResolver("landscape")}
  drilldownLink={UrlBuilder.calendar()}
>
  {#snippet item(entry)}
    <CalendarItem item={entry} />
  {/snippet}

  {#snippet ctaItem()}
    <CtaItem cta={{ type: "upcoming" }} variant="card" />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <CtaItem cta={{ type: "upcoming" }} variant="placeholder" />
    {/if}
  {/snippet}

  {#snippet actions()}
    <CalendarButton />
  {/snippet}
</SectionList>
