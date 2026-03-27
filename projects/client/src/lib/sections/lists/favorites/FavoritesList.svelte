<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import { useFavoritesList } from "../stores/useFavoritesList";
  import FavoriteMediaItem from "./_internal/FavoriteMediaItem.svelte";

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

  const listId = $derived(`favorites-list-${mode}-${slug}`);
</script>

<DrillableMediaList
  {title}
  id={listId}
  type={mode}
  useList={(params) => useFavoritesList({ ...params, slug })}
  drilldownLabel={m.button_label_view_all_favorites()}
  source={{ id: "favorites", type: mode }}
  urlBuilder={() => UrlBuilder.profile.favorites(slug)}
>
  {#snippet item(media)}
    <FavoriteMediaItem {media} {mode} isActionable={$isMe} />
  {/snippet}

  {#snippet ctaItem()}
    {#if $isMe}
      <CtaItem {cta} variant="card" />
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
