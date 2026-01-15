<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import { languageTag } from "$lib/features/i18n";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaRating } from "$lib/requests/models/MediaRating";
  import { toPercentage } from "$lib/utils/formatting/number/toPercentage";
  import {
    toRottenAudienceRating,
    toRottenCriticRating,
    toRottenPercentage,
  } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import { toVotesBasedRating } from "$lib/utils/formatting/number/toVotesBasedRating";
  import PopcornIcon from "../icons/PopcornIcon.svelte";
  import RatingIcon from "../icons/RatingIcon.svelte";
  import RottenIcon from "../icons/RottenIcon.svelte";
  import type { RatingIntl } from "./RatingIntl";
  import { RatingIntlProvider } from "./RatingIntlProvider";
  import RatingItem from "./RatingItem.svelte";
  import { getDisplayableRatings } from "./_internal/getDisplayableRatings";

  type RatingListProps = {
    i18n?: RatingIntl;
    ratings: MediaRating;
    airDate: Date;
    type: ExtendedMediaType;
  };

  const {
    i18n = RatingIntlProvider,
    ratings,
    airDate,
    type,
  }: RatingListProps = $props();

  const { trakt, imdb, rotten } = $derived(
    getDisplayableRatings({ ratings, airDate }),
  );
</script>

<div class="trakt-summary-ratings">
  <RatingItem
    rating={trakt?.rating && toPercentage(trakt.rating, languageTag())}
  >
    <RatingIcon style={toVotesBasedRating(trakt?.votes)} />
    {#snippet superscript()}
      {i18n.voteText(trakt?.votes ?? 0)}
    {/snippet}
  </RatingItem>

  <RatingItem rating={imdb?.rating} url={imdb?.url}>
    <IMDBIcon style={toVotesBasedRating(imdb?.votes)} />
    {#snippet superscript()}
      {i18n.voteText(imdb?.votes ?? 0)}
    {/snippet}
  </RatingItem>

  {#if type !== "episode"}
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
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-ratings {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    @include for-mobile() {
      gap: var(--gap-s);
    }
  }
</style>
