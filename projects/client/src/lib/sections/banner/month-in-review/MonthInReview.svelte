<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useMonthToDate } from "$lib/sections/profile/stores/useMonthToDate";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import MonthInReviewLink from "./_internal/MonthInReviewLink.svelte";
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

  // FIXME: dismissable & shared design with MonthToDate
</script>

<RenderFor audience="vip">
  {#if $review}
    <div class="trakt-month-in-review">
      {#if !$isLoadingMonthToDate}
        <div class="trakt-mir-cover-image">
          <CrossOriginImage
            loading="eager"
            src={$monthToDate.coverUrl}
            alt={"Background for ${$monthToDate.firstWatchedTitle}"}
            animate={false}
          />
        </div>
      {/if}

      <div class="trakt-mir-content">
        <div class="trakt-mir-header">
          <CalendarIcon />
          <p>Month in review</p>
        </div>

        <MonthInReviewStats review={$review} />
      </div>

      <MonthInReviewLink slug={$user.slug} date={previousMonth} />
    </div>
  {/if}
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-in-review,
  .trakt-mir-content,
  .trakt-mir-header {
    display: flex;
    align-items: center;
  }

  .trakt-month-in-review {
    --mir-content-gap: var(--gap-l);
    --mir-border-radius: var(--border-radius-l);

    position: relative;
    z-index: var(--layer-base);

    justify-content: space-between;
    gap: var(--mir-content-gap);

    height: var(--ni-56);

    box-sizing: border-box;
    padding: var(--ni-8) var(--ni-18);
    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);

    border-radius: var(--mir-border-radius);

    color: var(--shade-10);
    background: radial-gradient(
      60.59% 305.37% at 100% 100%,
      var(--purple-500) 0%,
      var(--shade-900) 100%
    );

    transition: var(--transition-increment) ease-in-out;
    transition-property: background, height, padding, gap;

    @include for-tablet-sm-and-below {
      --mir-content-gap: var(--gap-m);

      flex-direction: column;
      align-items: flex-start;
      justify-content: normal;

      height: var(--ni-128);
      padding: var(--ni-14);

      background: radial-gradient(
        78.23% 78.23% at 0% 100%,
        var(--purple-500) 0%,
        var(--shade-900) 100%
      );

      .trakt-mir-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .trakt-mir-cover-image {
        width: 100%;
        mask-image: none;
      }
    }
  }

  .trakt-mir-header {
    gap: var(--gap-xs);

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }

  .trakt-mir-content {
    transition: gap var(--transition-increment) ease-in-out;
    gap: var(--mir-content-gap);
  }

  .trakt-mir-cover-image {
    position: absolute;
    top: 0;
    left: 0;

    width: 25%;
    height: 100%;

    overflow: hidden;
    border-radius: var(--mir-border-radius);
    z-index: var(--layer-background);

    mask-image: linear-gradient(90deg, #000 0%, #000 75%, transparent 100%);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0.2;
    }
  }
</style>
