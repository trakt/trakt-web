<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { MediaRating } from "$lib/requests/models/MediaRating";
  import {
    toRottenAudienceRating,
    toRottenCriticRating,
    toRottenPercentage,
  } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating";
  import { toVotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
  import ActionButton from "../buttons/ActionButton.svelte";
  import PopcornIcon from "../icons/PopcornIcon.svelte";
  import RatingIcon from "../icons/RatingIcon.svelte";
  import RottenIcon from "../icons/RottenIcon.svelte";
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
    variant?: "all" | "external";
  };

  const {
    i18n = RatingIntlProvider,
    ratings,
    entry,
    drilldown,
    variant = "all",
  }: RatingListProps = $props();

  const { trakt, imdb, rotten } = $derived(
    getDisplayableRatings({ ratings, entry }),
  );

  const isMediaEntry = $derived(
    entry.type === "show" || entry.type === "movie",
  );
</script>

{#snippet traktItem()}
  <RatingItem
    rating={trakt?.rating && toTraktRating(trakt.rating, getLocale())}
  >
    <RatingIcon style={toVotesBasedRating(trakt?.votes)} />
    {#snippet superscript()}
      {i18n.voteText(trakt?.votes ?? 0)}
    {/snippet}
  </RatingItem>
{/snippet}

<div class="trakt-summary-ratings">
  {#if variant === "all"}
    {@render traktItem()}
  {/if}

  <RatingItem rating={imdb?.rating} url={imdb?.url}>
    <IMDBIcon style={toVotesBasedRating(imdb?.votes)} />
    {#snippet superscript()}
      {i18n.voteText(imdb?.votes ?? 0)}
    {/snippet}
  </RatingItem>

  {#if isMediaEntry}
    <RatingItem rating={toRottenPercentage(rotten?.critic)} url={rotten?.url}>
      <RottenIcon style={toRottenCriticRating(rotten?.critic)} />
      {#snippet superscript()}
        {toRottenCriticRating(rotten?.critic ?? 0)}
      {/snippet}
    </RatingItem>

    <RatingItem rating={toRottenPercentage(rotten?.audience)} url={rotten?.url}>
      <PopcornIcon style={toRottenAudienceRating(rotten?.audience)} />
      {#snippet superscript()}
        {toRottenAudienceRating(rotten?.audience ?? 0)}
      {/snippet}
    </RatingItem>
  {/if}

  {#if drilldown}
    <ActionButton
      classList="trakt-ratings-drilldown-button"
      href={drilldown.href}
      noscroll={drilldown.noscroll}
      replacestate={drilldown.replacestate}
      label={i18n.viewBreakdownLabel()}
      style="ghost"
      size="small"
    >
      <CaretRightIcon />
    </ActionButton>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-ratings {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    :global(.trakt-ratings-drilldown-button) {
      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    @include for-mobile() {
      gap: var(--gap-s);
    }
  }
</style>
