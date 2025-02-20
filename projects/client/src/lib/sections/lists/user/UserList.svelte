<script lang="ts">
  import Preview from "$lib/components/badge/Preview.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import MediaCard from "../components/MediaCard.svelte";
  import { useUserList } from "./useUserList";

  type UserListProps = {
    title: string;
    userId: string;
    listId: string;
    type?: MediaType;
  };

  const { title, userId, listId, type }: UserListProps = $props();

  const { list } = $derived(useUserList({ userId, listId, type }));
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<!-- TODO use drilled media list & fetch rest on scroll -->
<GridList
  id={`userlist-list-${userId}-${listId}`}
  {title}
  items={$list}
  --width-item="var(--width-poster-card)"
>
  {#snippet item(media)}
    <MediaCard type={media.type} {media} {style} />
  {/snippet}

  {#snippet badge()}
    <Preview />
  {/snippet}
</GridList>
