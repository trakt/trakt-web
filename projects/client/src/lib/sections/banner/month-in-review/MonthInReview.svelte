<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ReviewContent from "$lib/sections/components/ReviewContent.svelte";
  import { useMonthToDate } from "$lib/sections/profile/stores/useMonthToDate";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { slide } from "svelte/transition";
  import MonthInReviewLink from "../../components/MonthInReviewLink.svelte";
  import MonthInReviewStats from "./_internal/MonthInReviewStats.svelte";
  import { useMonthInReview } from "./_internal/useMonthInReview";

  const { user } = useUser();

  const now = new Date();
  const previousMonth = getPreviousMonth(now);

  const { review } = $derived(
    useMonthInReview({
      slug: $user.slug,
      month: previousMonth.getMonth() + 1,
      year: previousMonth.getFullYear(),
    }),
  );

  const { monthToDate, isLoading: isLoadingMonthToDate } = $derived(
    useMonthToDate({ slug: $user.slug }),
  );

  // FIXME: dismissable
</script>

<RenderFor audience="vip">
  {#if $review && !$isLoadingMonthToDate}
    <div class="trakt-month-in-review" transition:slide={{ duration: 150 }}>
      <ReviewContent coverSrc={$monthToDate.coverUrl} variant="gradient">
        {#snippet header()}
          <div class="trakt-mir-header">
            <CalendarIcon />
            <p class="bold uppercase">Month in review</p>
          </div>
        {/snippet}

        <MonthInReviewStats review={$review} />

        {#snippet footer()}
          <MonthInReviewLink slug={$user.slug} date={previousMonth} />
        {/snippet}
      </ReviewContent>
    </div>
  {/if}
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-in-review {
    :global(.trakt-review-content) {
      --review-content-height: var(--ni-56);
      flex-direction: row;
    }

    :global(.trakt-review-content-cover-image) {
      width: 25%;
      mask-image: linear-gradient(90deg, #000 0%, #000 75%, transparent 100%);
    }

    :global(.trakt-review-content-footer) {
      margin-left: auto;
    }

    @include for-tablet-sm-and-below {
      :global(.trakt-review-content-cover-image) {
        width: 100%;
        mask-image: none;
      }

      :global(.trakt-review-content-footer) {
        margin-left: 0;
      }

      :global(.trakt-review-content) {
        --review-content-height: var(--ni-148);
        flex-direction: column;

        background: radial-gradient(
          78.23% 78.23% at 0% 100%,
          var(--purple-500) 0%,
          var(--shade-900) 100%
        );
      }
    }
  }

  .trakt-mir-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
