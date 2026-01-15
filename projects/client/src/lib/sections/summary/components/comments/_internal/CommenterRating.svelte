<script lang="ts">
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale } from "$lib/features/i18n";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { STAR_RATINGS } from "../../rating/constants";

  const MAX_RATING = 10;

  const { comment }: { comment: MediaComment } = $props();

  const { user } = useUser();
  const isOwnComment = $derived(comment.user.id === $user.id);

  const rating = $derived.by(() => {
    const rating = comment.user.stats.rating;
    if (!rating) return;

    const factor = MAX_RATING / STAR_RATINGS.length;
    return rating / factor;
  });
</script>

{#if !isOwnComment && rating}
  <div class="trakt-commenter-rating">
    <span>{toHumanNumber(rating, getLocale())}</span>
    <StarIcon fill="full" />
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
