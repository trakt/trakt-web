<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { LoreMovie } from "$lib/requests/models/LoreMovie.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { MovieLore } from "$lib/requests/models/MovieLore.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import MovieLoreBadge from "./MovieLoreBadge.svelte";
  import MovieLoreFilmPoster from "./MovieLoreFilmPoster.svelte";
  import MovieLorePosterCard from "./MovieLorePosterCard.svelte";
  import { toLoreVerdictLabel } from "./toLoreVerdictLabel.ts";

  const { watchFirst, earlier, movie, mustWatchIds, watchedIds }: {
    watchFirst: NonNullable<MovieLore["watchFirst"]>;
    earlier: ReadonlyArray<LoreMovie>;
    movie: MovieEntry;
    mustWatchIds: ReadonlySet<number>;
    watchedIds: ReadonlySet<number>;
  } = $props();
</script>

<section class="trakt-movie-lore-watch-first">
  <h3>{m.header_movie_lore_need_films()}</h3>
  <div class="watch-first-card">
    <div class="watch-first-verdict">
      <MovieLoreBadge tone={watchFirst.verdict}>
        {toLoreVerdictLabel(watchFirst.verdict)}
      </MovieLoreBadge>
    </div>
    <p><InlineMarkdown text={watchFirst.note} /></p>
    {#if earlier.length > 0}
      <div class="watch-first-films">
        {#each earlier as film (film.id)}
          <MovieLoreFilmPoster
            {film}
            tone={mustWatchIds.has(film.id) ? "must-watch" : "optional"}
            isWatched={watchedIds.has(film.id)}
          />
        {/each}
        <MovieLorePosterCard
          media={movie}
          tone="current"
          isWatched={watchedIds.has(movie.id)}
        />
      </div>
    {/if}
  </div>
</section>

<style lang="scss">
  .trakt-movie-lore-watch-first {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    .watch-first-card {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
      padding: var(--gap-m);
      border-radius: var(--border-radius-l);
      background: var(--recap-card-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--recap-card-ring);

      :global(.trakt-inline-markdown) {
        font-size: inherit;
      }
    }

    .watch-first-verdict {
      display: flex;
    }

    .watch-first-films {
      display: flex;
      gap: var(--gap-s);
      padding-block: var(--gap-xs);
      overflow-x: auto;
      scrollbar-width: none;
    }
  }
</style>
