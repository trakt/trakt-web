<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieLore } from "$lib/requests/models/MovieLore.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import MovieLoreFilm from "./MovieLoreFilm.svelte";

  const { watchFirst, watchedIds }: {
    watchFirst: NonNullable<MovieLore["watchFirst"]>;
    watchedIds: ReadonlySet<number>;
  } = $props();
</script>

<section class="trakt-movie-lore-watch-first">
  <h3>{m.header_movie_lore_need_others()}</h3>

  <div class="watch-first-card">
    <p><InlineMarkdown text={watchFirst.note} /></p>

    {#if watchFirst.movies.length > 0}
      <div class="watch-first-films">
        {#each watchFirst.movies as movie (movie.id)}
          <MovieLoreFilm {movie} isWatched={watchedIds.has(movie.id)} />
        {/each}
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

    .watch-first-films {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }
  }
</style>
