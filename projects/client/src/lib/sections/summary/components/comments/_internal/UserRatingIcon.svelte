<script lang="ts">
  import { SimpleRating } from "$lib/models/SimpleRating";
  import UserRating from "../../rating/UserRating.svelte";

  const { rating }: { rating: SimpleRating } = $props();
</script>

<div class="trakt-user-rating-icon">
  <UserRating {rating} isCurrentRating={true} />
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
