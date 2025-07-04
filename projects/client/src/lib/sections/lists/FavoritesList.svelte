<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import FavoriteAction from "../media-actions/favorite/FavoriteAction.svelte";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import { useFavoritesList } from "./stores/useFavoritesList";

  const {
    type,
    title,
    emptyMessage,
    slug,
  }: { type: MediaType; title: string; emptyMessage: string; slug: string } =
    $props();

  const { filterMap } = useFilter();
  const { list, isLoading } = $derived(
    useFavoritesList({
      type,
      slug,
      filter: $filterMap,
    }),
  );
  const defaultVariant = $derived(useDefaultCardVariant(type));
</script>

<SectionList
  id={`favorites-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver($defaultVariant)}
>
  {#snippet item(media)}
    <DefaultMediaItem {type} media={media.item}>
      {#snippet popupActions()}
        <FavoriteAction
          style="dropdown-item"
          title={media.item.title}
          {type}
          id={media.item.id}
        />
      {/snippet}
    </DefaultMediaItem>
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="small secondary">
        {emptyMessage}
      </p>
    {/if}
  {/snippet}
</SectionList>
