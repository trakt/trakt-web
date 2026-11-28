<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MovieLore } from "$lib/requests/models/MovieLore.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import MovieLoreFilm from "./MovieLoreFilm.svelte";

  const { watchFirst, watchedIds, earlierCount }: {
    watchFirst: NonNullable<MovieLore["watchFirst"]>;
    watchedIds: ReadonlySet<number>;
    earlierCount: number;
  } = $props();

  const isShortList = $derived(
    watchFirst.movies.length > 0 && watchFirst.movies.length < earlierCount,
  );
</script>

<section class="trakt-movie-lore-watch-first">
  <h3>{m.header_movie_lore_need_others()}</h3>

  <div class="watch-first-card">
    <p><InlineMarkdown text={watchFirst.note} /></p>

    {#if isShortList}
      <div class="watch-first-label small">
        <span class="bold">{m.text_movie_lore_watch_first_label()}</span>
        <span class="secondary">
          {m.text_movie_lore_watch_first_count({
            count: watchFirst.movies.length,
            total: earlierCount,
          })}
        </span>
      </div>
    {/if}

    {#if watchFirst.movies.length > 0}
      <div class="watch-first-films">
        {#each watchFirst.movies as movie (movie.id)}
          <MovieLoreFilm {movie} isWatched={watchedIds.has(movie.id)} />
        {/each}
      </div>
    {/if}

    {#if isShortList}
      <span class="small secondary">
        {m.text_movie_lore_watch_first_recapped({ total: earlierCount })}
      </span>
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

    .watch-first-label {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--gap-xxs) var(--gap-xs);

      padding-top: var(--gap-s);
      border-top: var(--border-thickness-xxs) solid var(--recap-card-ring);

      .bold {
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
    }

    .watch-first-films {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }
  }
</style>
