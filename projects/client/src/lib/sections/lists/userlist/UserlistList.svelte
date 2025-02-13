<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MediaCard from "../components/MediaCard.svelte";
  import { useUserlistList } from "./useUserlistList";

  type UserlistListProps = {
    title: string;
    emptyMessage: string;
    userId: string;
    listId: string;
    type?: MediaType;
  };

  const { title, emptyMessage, userId, listId, type }: UserlistListProps =
    $props();

  const { isLoading, list } = $derived(
    useUserlistList({ userId, listId, type }),
  );
</script>

<!-- TODO use drilled media list & fetch rest on scroll -->
<GridList
  id={`userlist-list-${userId}-${listId}`}
  {title}
  items={$list}
  --width-item="var(--width-poster-card)"
>
  {#snippet empty()}
    {#if !$isLoading && emptyMessage}
      <p class="small secondary">
        {emptyMessage}
      </p>
    {/if}
  {/snippet}
  {#snippet item(media)}
    <MediaCard type={media.type} {media} />
  {/snippet}
</GridList>
