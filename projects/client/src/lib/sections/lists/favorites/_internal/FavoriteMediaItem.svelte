<script lang="ts">
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import type { FavoritedEntry } from "$lib/requests/models/FavoritedEntry";
  import FavoriteAction from "$lib/sections/media-actions/favorite/FavoriteAction.svelte";
  import type { Snippet } from "svelte";
  import DefaultMediaItem from "../../components/DefaultMediaItem.svelte";

  const {
    media,
    mode,
    isActionable,
    style = "cover",
    sortTag,
  }: {
    media: FavoritedEntry;
    mode: DiscoverMode;
    isActionable: boolean;
    style?: "summary" | "cover";
    sortTag?: Snippet;
  } = $props();
</script>

{#snippet popupActions()}
  <FavoriteAction
    style="dropdown-item"
    title={media.item.title}
    type={media.item.type}
    id={media.item.id}
  />
{/snippet}

<DefaultMediaItem
  {style}
  type={media.item.type}
  media={media.item}
  source="favorites"
  mode={mode === "media" ? "mixed" : "standalone"}
  popupActions={isActionable ? popupActions : undefined}
  {sortTag}
/>
