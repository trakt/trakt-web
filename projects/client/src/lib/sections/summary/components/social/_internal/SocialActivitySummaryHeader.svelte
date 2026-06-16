<script lang="ts">
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toUserRating } from "$lib/utils/formatting/number/toUserRating";

  type SocialActivitySummaryHeaderProps = {
    activityCount: number;
    ratings: number[];
  };

  const { activityCount, ratings }: SocialActivitySummaryHeaderProps = $props();

  const activityCountLabel = $derived(
    `${activityCount} ${activityCount === 1 ? m.text_social_activity() : m.text_social_activities()}`,
  );

  const averageRating = $derived.by(() => {
    if (ratings.length === 0) return null;

    const totalRating = ratings.reduce((total, rating) => total + rating, 0);
    return totalRating / ratings.length;
  });
</script>

<header class="trakt-social-activity-summary-header">
  <p class="secondary small bold">
    {activityCountLabel}
  </p>

  {#if averageRating}
    <div class="social-activity-summary-rating">
      <span class="secondary small bold">
        {toUserRating(averageRating, getLocale())}
      </span>
      <span class="social-activity-summary-rating-icon secondary">
        <StarIcon fill="full" />
      </span>
    </div>
  {/if}
</header>

<style>
  .trakt-social-activity-summary-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
    padding: 0 var(--gap-s) var(--ni-2);
    min-width: 0;
  }

  .social-activity-summary-rating {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--ni-4);
    flex: 0 0 auto;
    font-variant-numeric: tabular-nums;
  }

  .social-activity-summary-rating-icon {
    display: inline-flex;
    width: var(--ni-14);
    height: var(--ni-14);

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
