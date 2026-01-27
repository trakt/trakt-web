<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toTraktRating } from "$lib/utils/formatting/number/toTraktRating";

  type RatedItem = {
    airDate: Date;
    rating?: number | Nil;
  };

  const { item }: { item: RatedItem } = $props();
  const hasAired = $derived(!!item.airDate && item.airDate <= new Date());
</script>

{#if item.rating && hasAired}
  <div class="trakt-summary-card-rating">
    <RatingIcon style="rated" />
    <p class="bold">{toTraktRating(item.rating, getLocale())}</p>
  </div>
{/if}

<style>
  .trakt-summary-card-rating {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
