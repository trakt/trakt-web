<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import {
    useFavoritesList,
    type UseFavoritesProps,
  } from "../stores/useFavoritesList";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import FavoriteMediaItem from "./_internal/FavoriteMediaItem.svelte";
  import FavoritesYearGroup from "./_internal/FavoritesYearGroup.svelte";
  import { toYearGroupedFavorites } from "./_internal/toYearGroupedFavorites";

  const {
    title,
    slug,
    mode,
  }: { title: string; slug: string; mode: DiscoverMode } = $props();

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

  const variant = $derived(useDefaultCardVariant(mode));
  const listHeight = $derived(
    `calc(${mediaListHeightResolver($variant)} + var(--height-year-label))`,
  );

  function useYearGroupedFavoritesList(params: UseFavoritesProps) {
    const result = useFavoritesList(params);
    return {
      ...result,
      list: result.list.pipe(
        map(toYearGroupedFavorites),
      ),
    };
  }
</script>

<DrillableMediaList
  --height-year-label="var(--ni-20)"
  --list-header-gap="0"
  --height-override-list={listHeight}
  {title}
  id={{
    scope: "favorites-list",
    key: `${mode}-${slug}`,
  }}
  type={mode}
  useList={(params) => useYearGroupedFavoritesList({ ...params, slug })}
  drilldownLabel={m.button_label_view_all_favorites()}
  source={{ id: "favorites", type: mode }}
  urlBuilder={() => UrlBuilder.profile.favorites(slug)}
>
  {#snippet item(media)}
    <FavoritesYearGroup year={media.yearHeader}>
      <FavoriteMediaItem {media} {mode} isActionable={$isMe} />
    </FavoritesYearGroup>
  {/snippet}

  {#snippet ctaItem()}
    {#if $isMe}
      <FavoritesYearGroup>
        <CtaItem {cta} variant="card" />
      </FavoritesYearGroup>
    {/if}
  {/snippet}

  {#snippet empty()}
    {#if $isMe}
      <CtaItem {cta} variant="placeholder" />
    {:else}
      <p class="secondary">
        {placeholderMessage}
      </p>
    {/if}
  {/snippet}
</DrillableMediaList>
