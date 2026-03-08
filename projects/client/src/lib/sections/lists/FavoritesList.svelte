<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import FavoriteAction from "../media-actions/favorite/FavoriteAction.svelte";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import { useFavoritesList } from "./stores/useFavoritesList";

  const {
    title,
    slug,
    mode,
  }: { title: string; slug: string; mode: DiscoverMode } = $props();

  const { list, isLoading } = $derived(
    useFavoritesList({
      type: mode,
      slug,
    }),
  );
  const defaultVariant = $derived(useDefaultCardVariant(mode));

  const placeholderMessage = $derived.by(() => {
    switch (mode) {
      case "movie":
        return m.list_placeholder_favorite_movies();
      case "show":
        return m.list_placeholder_favorite_shows();
      default:
        return m.list_placeholder_favorites();
    }
  });

  const { isMe } = $derived(useIsMe(slug));
  const cta = $derived({
    type: "favorites" as const,
    mediaType: mode === "media" ? undefined : mode,
  });

  const listId = $derived(`favorites-list-${mode}-${slug}`);
</script>

<SectionList
  id={listId}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver($defaultVariant)}
>
  {#snippet item(media)}
    <DefaultMediaItem
      type={media.item.type}
      media={media.item}
      source="favorites"
      mode={mode === "media" ? "mixed" : "standalone"}
    >
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

  {#snippet ctaItem()}
    {#if $isMe}
      <CtaItem {cta} variant="card" />
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading}
      {#if $isMe}
        <CtaItem {cta} variant="placeholder" />
      {:else}
        <p class="secondary">
          {placeholderMessage}
        </p>
      {/if}
    {:else}
      <SkeletonList id={listId} variant="portrait" />
    {/if}
  {/snippet}
</SectionList>
