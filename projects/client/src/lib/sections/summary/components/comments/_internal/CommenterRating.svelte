<script lang="ts">
  import RatingIcon from "$lib/components/icons/RatingIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale } from "$lib/features/i18n";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { toUserRating } from "$lib/utils/formatting/number/toUserRating";

  const { comment }: { comment: MediaComment } = $props();

  const { user } = useUser();
  const isOwnComment = $derived(comment.user.id === $user.id);

  const rating = $derived.by(() => {
    const rating = comment.user.stats.rating;
    if (!rating) return;

    return toUserRating(rating, getLocale());
  });
</script>

{#if !isOwnComment && rating}
  <div class="trakt-commenter-rating">
    <span>{rating}</span>
    <RatingIcon style="rated" variant="user" />
  </div>
{/if}

<style>
  .trakt-commenter-rating {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
