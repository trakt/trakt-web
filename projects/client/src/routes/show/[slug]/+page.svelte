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
  import { useShow } from "./useShow";

  const { show, ratings } = useShow($page.params.slug);
  const type = "show";
  const {
    markAsWatched,
    isLoading: isMarkingAsWatched,
    isWatched,
  } = useMarkAsWatched({
    type,
  });

  const { watchlist, isAddingToWatchlist, isWatchlisted } = useWatchlist({
    type,
    id: $show?.id,
  });
</script>

<!-- FIXME: extract separate components out for easy re-use -->
{#if $show != null && $ratings != null}
  <BackgroundCoverImage src={$show.cover.url} {type} />

  <div class="trakt-summary-container">
    <div class="trakt-summary-poster">
      <SummaryPoster src={$show.poster.url} alt={$show.title}>
        {#snippet actions()}
          <Button
            label={m.add_to_watchlist_label({ title: $show.title })}
            variant="custom"
            onclick={() => watchlist($show.id)}
            disabled={$isAddingToWatchlist || $isWatchlisted}
            --color-background-button="var(--blue-200)"
            --color-foreground-button="var(--blue-800)"
          >
            {m.add_to_watchlist()}
            {#snippet icon()}
              <PlusIcon />
            {/snippet}
          </Button>

          <Button
            label={m.mark_as_watched_label({ title: $show.title })}
            variant="custom"
            onclick={() => markAsWatched($show.id)}
            disabled={isMarkingAsWatched($show.id) || isWatched($show.id)}
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
        <h3>{$show.title}</h3>
        <GenreList genres={$show.genres} />
      </div>

      <RatingList ratings={$ratings} />

      <p class="trakt-media-overview secondary">{$show.overview}</p>
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
