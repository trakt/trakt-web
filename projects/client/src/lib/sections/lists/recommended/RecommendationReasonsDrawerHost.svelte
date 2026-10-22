<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { recommendationReasonsQuery } from "$lib/requests/queries/recommendations/recommendationReasonsQuery.ts";
  import { map } from "rxjs";
  import { untrack } from "svelte";
  import RecommendationSourcesDrawer from "./RecommendationSourcesDrawer.svelte";
  import type { RecommendationReasonsDrawerHostProps } from "./RecommendationReasonsDrawerHostProps.ts";
  import { toRecommendationWhyTracking } from "./toRecommendationWhyTracking.ts";


  const {
    type,
    id,
    sources,
    people,
    title,
    onClose,
  }: RecommendationReasonsDrawerHostProps = $props();

  const deferredReasons = untrack(() =>
    useQuery(recommendationReasonsQuery({ type, id })).pipe(
      map((state) => state.data),
    ),
  );
  const reasons = $derived(
    sources.length > 0 || people.length > 0
      ? { sources, people }
      : $deferredReasons,
  );

  const { track } = useTrack(AnalyticsEvent.RecommendationWhy);
  let isTracked = false;
  $effect(() => {
    if (isTracked || !reasons) return;
    isTracked = true;
    track(toRecommendationWhyTracking(reasons));
  });
</script>

<RecommendationSourcesDrawer
  isLoading={!reasons}
  sources={reasons?.sources ?? []}
  people={reasons?.people ?? []}
  {title}
  {onClose}
/>
