<script lang="ts">
  import { page } from "$app/stores";
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import RatingList from "$lib/components/summary/RatingList.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
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
    <div class="trakt-summary-poster">
      <SummaryPoster src={$movie.poster.url} alt={$movie.title}>
        {#snippet actions()}
          <Button
            label={m.add_to_watchlist_label({ title: $movie.title })}
            variant="custom"
            onclick={() => add([$movie.id])}
            disabled={isAddingToWatchlist($movie.id) ||
              isWatchlisted($movie.id)}
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
        {/snippet}
      </SummaryPoster>
    </div>
    <div class="trakt-summary-details">
      <div class="trakt-summary-header">
        <h3>{$movie.title}</h3>
        <GenreList genres={$movie.genres} />
      </div>

      <RatingList ratings={$ratings} />

      <p class="trakt-media-overview secondary">{$movie.overview}</p>
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
      grid-template-columns: 1fr;

      :global(.trakt-summary-poster) {
        height: var(--ni-120);
        visibility: hidden;
        pointer-events: none;
      }
    }
  }

  .trakt-summary-details {
    display: flex;
    flex-direction: column;
    align-self: end;
    gap: var(--ni-32);

    .trakt-summary-header {
      display: flex;
      flex-direction: column;
      gap: var(--ni-8);
    }

    .trakt-media-overview {
      line-height: 150%;
    }
  }
</style>
