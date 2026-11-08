<script lang="ts">
  import DiscoverList from "../_internal/DiscoverList.svelte";
  import type { DiscoverListProps } from "../_internal/DiscoverListProps";
  import AnticipatedListItem from "./AnticipatedListItem.svelte";
  import { useAnticipatedList } from "./useAnticipatedList";

  const props: DiscoverListProps = $props();
</script>

<DiscoverList {...props} name="anticipated" useList={useAnticipatedList}>
  {#snippet listItem(media, mode)}
    <AnticipatedListItem type={media.type} {media} {mode} />
  {/snippet}
</DiscoverList>
