<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import type { MediaRating } from "$lib/models/MediaRating";
  import { toIMDBRating } from "$lib/utils/formatting/number/toIMDBRating";
  import { toRottenTomatoRating } from "$lib/utils/formatting/number/toRottenTomatoRating";
  import type { RatingIntl } from "./RatingIntl";
  import { RatingIntlProvider } from "./RatingIntlProvider";
  type RatingListProps = {
    i18n?: RatingIntl;
    ratings: MediaRating;
  };

  const { i18n = RatingIntlProvider, ratings }: RatingListProps = $props();
  const { imdb, rotten } = ratings;
</script>

<div class="trakt-summary-ratings">
  <div class="rating-item imdb-rating">
    <IMDBIcon style={toIMDBRating(imdb.votes)} />
    <div class="rating-info">
      <p class="large bold">{imdb.votes === 0 ? "-" : imdb.rating}</p>
      {#if imdb.votes > 0}
        <p class="small bold secondary">
          {i18n.voteText(imdb.votes)}
        </p>
      {/if}
    </div>
  </div>
  <div class="rating-item rotten-rating">
    <RottenIcon style={toRottenTomatoRating(rotten.critic)} />
    <div class="rating-info">
      <p class="large bold">{rotten.critic === 0 ? "-" : rotten.critic}</p>
      {#if rotten.critic > 0}
        <p class="small bold uppercase secondary">
          {toRottenTomatoRating(rotten.critic)}
        </p>
      {/if}
    </div>
  </div>
</div>

<style>
  .trakt-summary-ratings {
    display: flex;
    align-items: center;
    gap: var(--ni-8);
  }

  .rating-item {
    display: flex;

    align-items: center;
    gap: var(--ni-4);
  }

  .rating-info {
    display: flex;
    align-items: start;
    gap: var(--ni-4);

    p {
      line-height: 90%;
    }
  }
</style>
