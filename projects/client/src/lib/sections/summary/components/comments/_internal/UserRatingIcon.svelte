<script lang="ts">
  import RateIcon from "$lib/components/icons/RateIcon.svelte";
  import type { SimpleRating } from "$lib/models/SimpleRating";

  const { rating }: { rating: SimpleRating } = $props();
</script>

<div class="trakt-user-rating-icon">
  <RateIcon {rating} />
</div>

<style>
  .trakt-user-rating-icon {
    width: var(--ni-20);
    height: var(--ni-20);

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--shade-500);
    color: white;
    border-radius: 50%;

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
