<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toUserRating } from "$lib/utils/formatting/number/toUserRating";

  const { rating }: { rating: number } = $props();
</script>

<div class="trakt-user-rating">
  <span>{toUserRating(rating, getLocale())}</span>
  <RatingIcon style="rated" variant="user" />
</div>

<style>
  .trakt-user-rating {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
