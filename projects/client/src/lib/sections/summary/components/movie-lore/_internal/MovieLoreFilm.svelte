<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { LoreMovie } from "$lib/requests/models/LoreMovie.ts";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { movie, isWatched }: {
    movie: LoreMovie;
    isWatched: boolean;
  } = $props();
</script>

<div class="trakt-movie-lore-film">
  <span class="film-poster" aria-hidden="true">
    {#if movie.poster}
      <CrossOriginImage src={movie.poster} alt="" />
    {/if}
  </span>

  <span class="film-title">
    <Link
      href={UrlBuilder.movie(movie.slug)}
      color="inherit"
      underline="hover"
    >
      <span class="bold">{movie.title}</span>
    </Link>
    {#if movie.year}
      <span class="small secondary">{movie.year}</span>
    {/if}
  </span>

  {#if isWatched}
    <span class="film-status tag bold">{m.tag_text_watched()}</span>
  {:else}
    <WatchlistAction
      style="normal"
      size="small"
      type="movie"
      media={movie}
      title={movie.title}
    />
  {/if}
</div>

<style lang="scss">
  .trakt-movie-lore-film {
    display: grid;
    grid-template-columns: var(--ni-36) minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ni-10);

    .film-poster {
      overflow: hidden;
      aspect-ratio: 2 / 3;

      border-radius: var(--ni-4);
      background-color: color-mix(
        in srgb,
        var(--color-text-primary) 8%,
        transparent
      );

      :global(img) {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .film-title {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .film-status {
      padding: var(--ni-2) var(--ni-10);

      border-radius: var(--border-radius-pill);
      background: var(--color-reality-accurate-background);
      color: var(--color-reality-accurate-text);
    }
  }
</style>
