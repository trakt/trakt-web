<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { scan } from "rxjs";
  import { getDayRange } from "./_internal/getDayRange.ts";
  import { toActivityRanges } from "./_internal/toActivityRanges.ts";
  import TodayStoryViewer from "./_internal/TodayStoryViewer.svelte";
  import { todayOverviewParams } from "./_internal/todayOverviewParams.ts";
  import { todayStoryNavigation } from "./_internal/todayStoryNavigation.ts";
  import { toTodayStories } from "./_internal/toTodayStories.ts";
  import { toOpenSource } from "./_internal/toOpenSource.ts";
  import type { TodayOpenSource } from "./models/TodayOpenSource.ts";
  import { useTodayStories } from "./useTodayStories.ts";

  const { filterMap } = useFilter();

  const { isOpen, storyKey, close } = $derived(
    todayStoryNavigation(page.url.searchParams),
  );
  let source: TodayOpenSource = $state("link");
  beforeNavigate(({ type, to }) => {
    source = toOpenSource({ navigationType: type, routeId: to?.route.id });
  });

  const params = $derived(todayOverviewParams(page.url.searchParams));
  const dayKey = $derived(params.day);
  const now = new Date();
  const range = fromRune(() => getDayRange({ dayKey, now }));
  const ranges = fromRune(() => toActivityRanges({ dayKey, now }));
  const { activities, forYou, isLoading } = $derived(
    useTodayStories({ type: "media", filter: $filterMap, range, ranges }),
  );

  const { groups } = $derived(
    toTodayStories({
      activities: $activities ?? [],
      forYou: $forYou ?? [],
    }),
  );

  const hasLoaded = $derived(
    isLoading.pipe(scan((loaded, loading) => loaded || !loading, false)),
  );
</script>

{#if isOpen && $hasLoaded && groups.length > 0}
  <TodayStoryViewer {groups} startKey={storyKey} {source} onClose={close} />
{/if}
