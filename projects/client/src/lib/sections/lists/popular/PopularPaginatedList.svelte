<script lang="ts">
  import DiscoverPaginatedList from "../_internal/DiscoverPaginatedList.svelte";
  import type { DiscoverPaginatedListProps } from "../_internal/DiscoverPaginatedListProps";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  const props: DiscoverPaginatedListProps = $props();
</script>

<DiscoverPaginatedList {...props} name="popular" useList={usePopularList}>
  {#snippet listItem(media, mode)}
    <PopularListItem type={media.type} {media} style="summary" {mode} />
  {/snippet}
</DiscoverPaginatedList>
