<script lang="ts">
  import { page } from "$app/state";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import { extractWatchWindowParam } from "./extractWatchWindowParam";
  import RecommendedListItem from "./RecommendedListItem.svelte";
  import { useRecommendedList } from "./useRecommendedList";

  type RecommendedListProps = {
    type: DiscoverMode;
  };

  const { type }: RecommendedListProps = $props();
  const { filterMap } = useFilter();

  const { current } = useToggler("recommendation");
  const { isEnabled } = useFeatureFlag();
  const isSmartEnabled = isEnabled(FeatureFlag.SmartRecommendations);
  const isSmart = $derived($isSmartEnabled && $current.value === "smart");
</script>

<DrilledMediaList
  id="view-all-recommended-${type}"
  {type}
  filter={{
    ...$filterMap,
    ...extractWatchWindowParam(page.url.searchParams),
  }}
  useList={(params) => useRecommendedList({ ...params, isSmart })}
>
  {#snippet item(media)}
    <RecommendedListItem
      type={media.type}
      {media}
      style="summary"
      mode={type === "media" ? "mixed" : "standalone"}
    />
  {/snippet}
</DrilledMediaList>
