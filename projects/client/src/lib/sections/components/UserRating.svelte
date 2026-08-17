<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import { toUserRating } from "$lib/utils/formatting/number/toUserRating";

  const { rating, size = "default" }: {
    rating: number;
    size?: "default" | "small";
  } = $props();
</script>

<div class="trakt-user-rating" data-size={size}>
  <span class:bold={size === "small"}>{toUserRating(rating, getLocale())}</span>
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

    &[data-size="small"] {
      span {
        font-size: var(--font-size-tag);
      }

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }
  }
</style>
