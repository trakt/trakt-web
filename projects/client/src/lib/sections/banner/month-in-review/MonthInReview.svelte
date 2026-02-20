<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ReviewContent from "$lib/sections/components/ReviewContent.svelte";
  import { DEFAULT_COVER } from "$lib/utils/constants";
  import MonthInReviewLink from "../../components/MonthInReviewLink.svelte";
  import DismissButton from "../_internal/DismissButton.svelte";
  import MonthInReviewStats from "./_internal/MonthInReviewStats.svelte";
  import { useMonthInReview } from "./_internal/useMonthInReview";

  const { month, onDismiss }: { month: Date; onDismiss: () => void } = $props();
  const { user } = useUser();

  const { review, isLoading } = $derived(
    useMonthInReview({
      slug: $user.slug,
      month: month.getMonth() + 1,
      year: month.getFullYear(),
    }),
  );
</script>

<div class="trakt-month-in-review">
  <ReviewContent
    coverSrc={$review?.firstPlay?.cover.url.medium ?? DEFAULT_COVER}
    variant="gradient"
  >
    {#snippet header()}
      <div class="trakt-mir-header-container">
        <div class="trakt-mir-header">
          <CalendarIcon />
          <p class="bold uppercase">Month in review</p>
        </div>

        <RenderFor audience="vip" device={["mobile", "tablet-sm"]}>
          <DismissButton {onDismiss} />
        </RenderFor>
      </div>
    {/snippet}

    <MonthInReviewStats review={$review} isLoading={$isLoading} />

    {#snippet footer()}
      <div class="trakt-mir-footer">
        <MonthInReviewLink slug={$user.slug} date={month} source="mir-banner" />
        <RenderFor audience="vip" device={["tablet-lg", "desktop"]}>
          <DismissButton {onDismiss} />
        </RenderFor>
      </div>
    {/snippet}
  </ReviewContent>
</div>

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

  .trakt-mir-header-container {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
  }

  .trakt-mir-header,
  .trakt-mir-footer {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
  }
</style>
