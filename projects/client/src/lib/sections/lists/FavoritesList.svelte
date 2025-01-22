<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/models/MediaType";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import FavoriteAction from "../media-actions/favorite/FavoriteAction.svelte";
  import MediaCard from "./components/MediaCard.svelte";
  import { useFavoritesList } from "./stores/useFavoritesList";

  const {
    type,
    title,
    emptyMessage,
  }: { type: MediaType; title: string; emptyMessage: string } = $props();

  const { list, isLoading } = useFavoritesList({ type });
</script>

<SectionList
  id={`favorites-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaCard {type} media={media.item}>
      {#snippet action()}
        <FavoriteAction
          style="action"
          title={media.item.title}
          {type}
          id={media.item.id}
        />
      {/snippet}
    </MediaCard>
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="small secondary">
        {emptyMessage}
      </p>
    {/if}
  {/snippet}
</SectionList>
