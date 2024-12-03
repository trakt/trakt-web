<script lang="ts">
  import IMDBIcon from "$lib/components/icons/IMDBIcon.svelte";
  import RottenIcon from "$lib/components/icons/RottenIcon.svelte";
  import type { MediaRating } from "$lib/models/MediaRating";
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
    <IMDBIcon />
    <div class="rating-info">
      <p class="large bold">{imdb.rating}</p>
      <p class="small bold secondary">{i18n.voteText(imdb.votes)}</p>
    </div>
  </div>
  <div class="rating-item rotten-rating">
    <RottenIcon />
    <div class="rating-info">
      <p class="large bold">{rotten.critic}</p>
      <p class="small bold uppercase secondary">
        {rotten.critic > 60 ? "Fresh" : "Rotten"}
      </p>
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
