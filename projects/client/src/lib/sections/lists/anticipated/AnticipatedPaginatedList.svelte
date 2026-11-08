<script lang="ts">
  import DiscoverPaginatedList from "../_internal/DiscoverPaginatedList.svelte";
  import type { DiscoverPaginatedListProps } from "../_internal/DiscoverPaginatedListProps";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  const props: DiscoverPaginatedListProps = $props();
</script>

<DiscoverPaginatedList
  {...props}
  name="anticipated"
  useList={useAnticipatedList}
>
  {#snippet listItem(media, mode)}
    <AnticipatedListItem type={media.type} {media} style="summary" {mode} />
  {/snippet}
</DiscoverPaginatedList>
