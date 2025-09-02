<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import * as m from "$lib/features/i18n/messages";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { writable } from "svelte/store";
  import MediaTypeToggles from "../components/MediaTypeToggles.svelte";
  import type { MediaToggleType } from "../components/models/MediaToggleType";
  import FavoriteAction from "../media-actions/favorite/FavoriteAction.svelte";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import { useFavoritesList } from "./stores/useFavoritesList";

  const { title, slug }: { title: string; slug: string } = $props();

  const selectedType = writable<MediaToggleType>("all");

  const handleTypeChange = (value: MediaToggleType) => {
    selectedType.set(value);
  };

  const type = $derived($selectedType === "all" ? undefined : $selectedType);

  const { filterMap } = useFilter();
  const { list, isLoading } = $derived(
    useFavoritesList({
      type,
      slug,
      filter: $filterMap,
    }),
  );
  const defaultVariant = $derived(useDefaultCardVariant(type));

  const placeholderMessage = $derived.by(() => {
    switch ($selectedType) {
      case "movie":
        return m.list_placeholder_favorite_movies();
      case "show":
        return m.list_placeholder_favorite_shows();
      default:
        return m.list_placeholder_favorites();
    }
  });
</script>

<SectionList
  id={`favorites-list-${selectedType}-${slug}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver($defaultVariant)}
>
  {#snippet item(media)}
    <DefaultMediaItem type={media.item.type} media={media.item}>
      {#snippet popupActions()}
        <FavoriteAction
          style="dropdown-item"
          title={media.item.title}
          type={media.item.type}
          id={media.item.id}
        />
      {/snippet}
    </DefaultMediaItem>
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      <p class="small secondary">
        {placeholderMessage}
      </p>
    {/if}
  {/snippet}

  {#snippet badge()}
    <MediaTypeToggles value={$selectedType} onChange={handleTypeChange} />
  {/snippet}
</SectionList>
