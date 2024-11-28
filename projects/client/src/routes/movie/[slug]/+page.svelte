<script lang="ts">
  import { page } from "$app/stores";
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import { useMovie } from "./useMovie";

  const { movie, ratings } = useMovie($page.params.slug);
  const type = "movie";
  const {
    markAsWatched,
    isLoading: isMarkingAsWatched,
    isWatched,
  } = useMarkAsWatched({
    type,
  });
  const {
    add,
    isLoading: isAddingToWatchlist,
    isWatchlisted,
  } = useWatchlist({ type });
</script>

<!-- FIXME: extract separate components out for easy re-use -->
{#if $movie != null && $ratings != null}
  <BackgroundCoverImage src={$movie.cover.url} {type} />

  <div class="trakt-summary-container">
    <div class="trakt-summary-main">
      <img src={$movie.poster.url} alt={$movie.title} />

      <Button
        label={m.add_to_watchlist_label({ title: $movie.title })}
        variant="custom"
        onclick={() => add([$movie.id])}
        disabled={isAddingToWatchlist($movie.id) || isWatchlisted($movie.id)}
        --color-background-button="var(--blue-200)"
        --color-foreground-button="var(--blue-800)"
      >
        {m.add_to_watchlist()}
        {#snippet icon()}
          <PlusIcon />
        {/snippet}
      </Button>

      <Button
        label={m.mark_as_watched_label({ title: $movie.title })}
        variant="custom"
        onclick={() => markAsWatched($movie.id)}
        disabled={isMarkingAsWatched($movie.id) || isWatched($movie.id)}
        --color-background-button="var(--purple-100)"
        --color-foreground-button="var(--purple-600)"
      >
        {m.mark_as_watched()}
        {#snippet icon()}
          <CheckIcon size="small" />
        {/snippet}
      </Button>
    </div>
    <div class="trakt-summary-details">
      <div class="trakt-summary-details-title">
        <h3>{$movie.title}</h3>
        <GenreList genres={$movie.genres} />
      </div>

      <div class="trakt-summary-ratings">
        <IMDBIcon /> <span>{$ratings.imdb}</span>
        <RottenIcon /> <span>{$ratings.rotten.audience}</span>
      </div>

      <p class="secondary">{$movie.overview}</p>
    </div>
  </div>
{/if}

<style>
  .trakt-summary-container {
    display: grid;
    gap: var(--ni-32);
    grid-template-columns: 1fr 2fr 1fr;
    margin: 0 var(--ni-56);

    @media (max-width: 680px) {
      display: flex;
      flex-direction: column;
      gap: var(--ni-16);
      align-items: center;
    }
  }

  .trakt-summary-main {
    width: var(--ni-320);
    display: flex;
    flex-direction: column;
    gap: var(--ni-16);

    img {
      border-radius: var(--ni-24);
      align-self: stretch;
      width: var(--ni-320);
      height: var(--ni-480);

      box-shadow: 0px 7.673px 23.02px 0px rgba(0, 0, 0, 0.56);
    }
  }

  .trakt-summary-details {
    display: flex;
    flex-direction: column;
    align-self: end;
    gap: var(--ni-32);

    .trakt-summary-details-title {
      display: flex;
      flex-direction: column;
      gap: var(--ni-8);
    }

    .trakt-summary-ratings {
      display: flex;
      align-items: center;
      gap: var(--ni-8);
    }
  }
</style>
