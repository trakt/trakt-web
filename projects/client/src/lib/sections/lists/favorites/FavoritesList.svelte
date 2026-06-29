<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import CtaItem from "$lib/sections/lists/components/cta/CtaItem.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { map } from "rxjs";
  import DrillableMediaList from "../drilldown/DrillableMediaList.svelte";
  import {
    useFavoritesList,
    type UseFavoritesProps,
  } from "../stores/useFavoritesList";
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

  const currentYear = new Date().getFullYear();

  const { isEnabled } = useFeatureFlag();
  const isFlagEnabled = $derived(isEnabled(FeatureFlag.ScopedFavorites));

  function useFavoritesListForYear(params: UseFavoritesProps) {
    const result = useFavoritesList(params);
    return {
      ...result,
      list: result.list.pipe(
        map((entries) =>
          entries.filter(
            (entry) => entry.favoritedAt.getFullYear() === currentYear,
          ),
        ),
      ),
    };
  }

  const useFavorites = $derived(
    $isFlagEnabled ? useFavoritesListForYear : useFavoritesList,
  );
</script>

<DrillableMediaList
  {title}
  id={{
    scope: "favorites-list",
    key: `${mode}-${slug}`,
  }}
  type={mode}
  useList={(params) => useFavorites({ ...params, slug })}
  drilldownLabel={m.button_label_view_all_favorites()}
  source={{ id: "favorites", type: mode }}
  urlBuilder={() => UrlBuilder.profile.favorites(slug)}
>
  {#snippet metaInfo()}
    <RenderForFeature flag={FeatureFlag.ScopedFavorites}>
      {#snippet enabled()}
        <p class="tag secondary">
          {currentYear}
        </p>
      {/snippet}
    </RenderForFeature>
  {/snippet}

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
