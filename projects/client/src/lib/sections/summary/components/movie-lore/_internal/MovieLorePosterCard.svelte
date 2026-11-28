<script lang="ts">
  import IndicatorTag from "$lib/components/media/tags/IndicatorTag.svelte";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import DefaultMediaPopupActions from "$lib/sections/lists/components/DefaultMediaPopupActions.svelte";
  import MediaCard from "$lib/sections/lists/components/MediaCard.svelte";
  import MovieLoreTag from "./MovieLoreTag.svelte";

  const { media, tone, isWatched }: {
    media: MovieEntry;
    tone: "must-watch" | "optional" | "current";
    isWatched: boolean;
  } = $props();
</script>

{#snippet coverTag()}
  <MovieLoreTag {tone} />
{/snippet}

{#snippet indicators()}
  {#if isWatched}
    <IndicatorTag indicator="watched" />
  {/if}
{/snippet}

{#snippet popupActions()}
  <DefaultMediaPopupActions {media} />
{/snippet}

{#snippet caption()}
  <span class="film-caption">
    <span class="film-title bold">{media.title}</span>
    <span class="film-year secondary">{media.year}</span>
  </span>
{/snippet}

<div class="trakt-movie-lore-poster-card" data-tone={tone}>
  <MediaCard
    type="movie"
    variant="portrait"
    {media}
    {coverTag}
    {indicators}
    tag={caption}
    popupActions={tone === "current" ? undefined : popupActions}
  />
</div>

<style lang="scss">
  .trakt-movie-lore-poster-card {
    --height-override-card: calc(
      var(--height-portrait-card-cover) + var(--ni-64)
    );

    flex-shrink: 0;

    &[data-tone="optional"] :global(div.trakt-card-cover-image) {
      opacity: var(--de-emphasized-opacity);
    }

    .film-caption {
      display: flex;
      flex-direction: column;
      align-self: flex-start;
      gap: var(--gap-micro);
      min-width: 0;
      width: 100%;
    }

    .film-title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      overflow: hidden;
      min-height: 2.5em;
      line-height: 1.25;
      color: var(--color-text-primary);
      overflow-wrap: anywhere;
    }

    .film-year {
      min-height: 1.25em;
      line-height: 1.25;
    }
  }
</style>
