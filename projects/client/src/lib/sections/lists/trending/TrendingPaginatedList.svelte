<script lang="ts">
  import DiscoverPaginatedList from "../_internal/DiscoverPaginatedList.svelte";
  import type { DiscoverPaginatedListProps } from "../_internal/DiscoverPaginatedListProps";
  import TrendingListItem from "./TrendingListItem.svelte";
  import { useTrendingList } from "./useTrendingList";

  const props: DiscoverPaginatedListProps = $props();
</script>

<DiscoverPaginatedList {...props} name="trending" useList={useTrendingList}>
  {#snippet listItem(media, mode)}
    <TrendingListItem type={media.type} {media} style="summary" {mode} />
  {/snippet}
</DiscoverPaginatedList>
