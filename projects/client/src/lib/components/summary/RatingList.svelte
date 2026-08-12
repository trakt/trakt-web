<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating";
  import { toIMDBRating } from "$lib/utils/formatting/number/toIMDBRating";
  import {
    toRottenAudienceRating,
    toRottenCriticRating,
    toRottenPercentage,
  } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating";
  import { toVotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
  import ActionButton from "../buttons/ActionButton.svelte";
  import LetterboxdIcon from "../icons/LetterboxdIcon.svelte";
  import MALIcon from "../icons/MALIcon.svelte";
  import PopcornIcon from "../icons/PopcornIcon.svelte";
  import RatingIcon from "../icons/RatingIcon.svelte";
  import RottenIcon from "../icons/RottenIcon.svelte";
  import TMDBIcon from "../icons/TMDBIcon.svelte";
  import WatchersIcon from "../icons/WatchersIcon.svelte";
  import type { RatingIntl } from "./RatingIntl";
  import { RatingIntlProvider } from "./RatingIntlProvider";
  import RatingItem from "./RatingItem.svelte";
  import { getDisplayableRatings } from "./_internal/getDisplayableRatings";

  type TraktRatingDrilldown = {
    href: string;
    noscroll: boolean;
    replacestate: boolean;
  };

  type RatingListProps = {
    i18n?: RatingIntl;
    ratings: MediaRating;
    entry: MediaEntry | EpisodeEntry;
    drilldown?: TraktRatingDrilldown;
    onDrilldown?: () => void;
    variant?: "summary" | "breakdown";
    isLoading?: boolean;
  };

  const {
    i18n = RatingIntlProvider,
    ratings,
    entry,
    drilldown,
    onDrilldown,
    variant = "summary",
    isLoading = false,
  }: RatingListProps = $props();

  const { trakt, imdb, tmdb, rotten, mal, letterboxd } = $derived(
    getDisplayableRatings({ ratings, entry }),
  );

  const isBreakdown = $derived(variant === "breakdown");
  const isDrilldown = $derived(drilldown != null || onDrilldown != null);

  const itemProps = $derived({
    isLoading,
    variant: isBreakdown ? ("tile" as const) : ("row" as const),
  });

  const isMediaEntry = $derived(
    entry.type === "show" || entry.type === "movie",
  );

  const showLetterboxd = $derived(
    isBreakdown && entry.type === "movie" && letterboxd?.rating != null,
  );

  const isAnime = $derived(isMediaEntry && entry.genres.includes("anime"));
  const showMal = $derived(mal?.rating != null || (isLoading && isAnime));

  const showTmdb = $derived(isBreakdown && tmdb?.rating != null);
</script>

{#snippet voteCount(votes: number | Nil)}
  {#if isBreakdown}
    <WatchersIcon />
  {/if}
  {i18n.voteText(votes ?? 0)}
{/snippet}

{#snippet sources()}
  {#if !isBreakdown}
    <RatingItem
      rating={trakt?.rating && toTraktRating(trakt.rating, getLocale())}
      {...itemProps}
    >
      <RatingIcon style={toVotesBasedRating(trakt?.votes)} />
      {#snippet superscript()}
        {@render voteCount(trakt?.votes)}
      {/snippet}
    </RatingItem>
  {/if}

  <RatingItem
    rating={imdb?.rating && toIMDBRating(imdb.rating, getLocale())}
    url={imdb?.url}
    {...itemProps}
  >
    <IMDBIcon style={toVotesBasedRating(imdb?.votes)} />
    {#snippet superscript()}
      {@render voteCount(imdb?.votes)}
    {/snippet}
  </RatingItem>

  {#if showMal}
    <RatingItem
      rating={mal?.rating != null
      ? toIMDBRating(mal.rating, getLocale())
      : undefined}
      url={mal?.url}
      {...itemProps}
    >
      <MALIcon style={toVotesBasedRating(mal?.votes ?? undefined)} />
      {#snippet superscript()}
        {@render voteCount(mal?.votes)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if isMediaEntry}
    <RatingItem
      rating={toRottenPercentage(rotten?.critic)}
      url={rotten?.url}
      {...itemProps}
    >
      <RottenIcon style={toRottenCriticRating(rotten?.critic)} />
      {#snippet superscript()}
        {toRottenCriticRating(rotten?.critic ?? 0)}
      {/snippet}
    </RatingItem>

    <RatingItem
      rating={toRottenPercentage(rotten?.audience)}
      url={rotten?.url}
      {...itemProps}
    >
      <PopcornIcon style={toRottenAudienceRating(rotten?.audience)} />
      {#snippet superscript()}
        {toRottenAudienceRating(rotten?.audience ?? 0)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if showLetterboxd && letterboxd}
    <RatingItem
      rating={toIMDBRating(letterboxd.rating, getLocale())}
      url={letterboxd.url}
      {...itemProps}
    >
      <LetterboxdIcon style={toVotesBasedRating(letterboxd.votes ?? undefined)} />
      {#snippet superscript()}
        {@render voteCount(letterboxd.votes)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if showTmdb && tmdb}
    <RatingItem
      rating={toIMDBRating(tmdb.rating, getLocale())}
      url={tmdb.url}
      {...itemProps}
    >
      <TMDBIcon />
      {#snippet superscript()}
        {@render voteCount(tmdb.votes)}
      {/snippet}
    </RatingItem>
  {/if}
{/snippet}

<div class="trakt-summary-ratings" data-variant={itemProps.variant}>
  {#if isDrilldown}
    <ActionButton
      classList="ratings-drilldown"
      onclick={onDrilldown}
      href={drilldown?.href}
      noscroll={drilldown?.noscroll}
      replacestate={drilldown?.replacestate}
      label={i18n.viewBreakdownLabel()}
      style="ghost"
      tooltip={false}
    >
      {@render sources()}
      <CaretRightIcon />
    </ActionButton>
  {:else}
    {@render sources()}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-ratings,
  .trakt-summary-ratings :global(.ratings-drilldown) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--gap-s);
  }

  .trakt-summary-ratings {
    :global(rating) {
      flex: 0 0 auto;
    }

    &[data-variant="tile"] {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--gap-s);

      :global(rating) {
        flex: initial;
      }
    }

    &[data-variant="row"] {
      :global(.ratings-drilldown) {
        width: auto;
        height: auto;
        min-height: var(--ni-28);

        flex-shrink: 1;

        padding-inline: var(--ni-8);
        margin-inline: var(--ni-neg-8);

        > :global(svg) {
          height: var(--font-size-text);
          width: auto;
        }
      }

      :global(.ratings-drilldown:hover) {
        box-shadow: none;
      }

      :global(.ratings-drilldown:active) {
        transform: scale(0.98);
      }
    }
  }
</style>
