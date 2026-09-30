<script lang="ts">
  import { page } from "$app/state";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { getDayRange } from "./_internal/getDayRange.ts";
  import { toActivityRanges } from "./_internal/toActivityRanges.ts";
  import TodayStoryViewer from "./_internal/TodayStoryViewer.svelte";
  import { todayOverviewParams } from "./_internal/todayOverviewParams.ts";
  import { todayStoryNavigation } from "./_internal/todayStoryNavigation.ts";
  import { toTodayStories } from "./_internal/toTodayStories.ts";
  import { useTodayStories } from "./useTodayStories.ts";

  const { mode } = useDiscover();
  const { filterMap } = useFilter();

  const { isOpen, storyKey, close } = $derived(
    todayStoryNavigation(page.url.searchParams),
  );
  const params = $derived(todayOverviewParams(page.url.searchParams));
  const dayKey = $derived(params.day);
  const now = new Date();
  const range = fromRune(() => getDayRange({ dayKey, now }));
  const ranges = fromRune(() => toActivityRanges({ dayKey, now }));
  const { activities, forYou, isLoading } = $derived(
    useTodayStories({ type: $mode, filter: $filterMap, range, ranges }),
  );

  const { groups } = $derived(
    toTodayStories({
      activities: $activities ?? [],
      forYou: $forYou ?? [],
    }),
  );
</script>

{#if isOpen && !$isLoading && groups.length > 0}
  <TodayStoryViewer {groups} startKey={storyKey} onClose={close} />
{/if}
