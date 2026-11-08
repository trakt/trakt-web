<script lang="ts">
  import DiscoverList from "../_internal/DiscoverList.svelte";
  import type { DiscoverListProps } from "../_internal/DiscoverListProps";
  import PopularListItem from "./PopularListItem.svelte";
  import { usePopularList } from "./usePopularList";

  const props: DiscoverListProps = $props();
</script>

<DiscoverList {...props} name="popular" useList={usePopularList}>
  {#snippet listItem(media, mode)}
    <PopularListItem type={media.type} {media} {mode} />
  {/snippet}
</DiscoverList>
