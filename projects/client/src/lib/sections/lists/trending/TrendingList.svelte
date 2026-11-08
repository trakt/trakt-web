<script lang="ts">
  import DiscoverList from "../_internal/DiscoverList.svelte";
  import type { DiscoverListProps } from "../_internal/DiscoverListProps";
  import TrendingListItem from "./TrendingListItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  const props: DiscoverListProps = $props();
</script>

<DiscoverList {...props} name="trending" useList={useTrendingList}>
  {#snippet listItem(media, mode)}
    <TrendingListItem type={media.type} {media} {mode} />
  {/snippet}
</DiscoverList>
