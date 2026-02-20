<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ReviewContent from "$lib/sections/components/ReviewContent.svelte";
  import BannerLoadingIndicator from "../_internal/BannerLoadingIndicator.svelte";
  import DismissButton from "../_internal/DismissButton.svelte";
  import { useYearInReview } from "./_internal/useYearInReview";
  import YearInReviewLink from "./_internal/YearInReviewLink.svelte";
  import YearInReviewStats from "./_internal/YearInReviewStats.svelte";
  import YirBackground from "./_internal/YirBackground.svelte";

  const { year, onDismiss }: { year: number; onDismiss: () => void } = $props();
  const { user } = useUser();

  const { review, isLoading } = $derived(
    useYearInReview({
      slug: $user.slug,
      year,
    }),
  );
</script>

{#if $isLoading || $review}
  <div class="trakt-year-in-review">
    <ReviewContent variant="gradient">
      <YirBackground {year} />

      {#snippet header()}
        <div class="trakt-yir-header-container">
          <div class="trakt-yir-header">
            <CalendarIcon />
            <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
              <p class="bold uppercase">Your {year} year in review is here!</p>
            </RenderFor>
            <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
              <div class="title-labels">
                <p class="bold uppercase tag">Year in</p>
                <p class="bold uppercase tag">Review</p>
              </div>
            </RenderFor>
          </div>

          <RenderFor audience="vip" device={["mobile", "tablet-sm"]}>
            <DismissButton {onDismiss} />
          </RenderFor>
        </div>
      {/snippet}

      {#if $isLoading}
        <BannerLoadingIndicator />
      {:else if $review}
        <YearInReviewStats review={$review} />
      {/if}

      {#snippet footer()}
        <div class="trakt-yir-footer">
          <YearInReviewLink {year} slug={$user.slug} source="yir-banner" />
          <RenderFor audience="vip" device={["tablet-lg", "desktop"]}>
            <DismissButton {onDismiss} />
          </RenderFor>
        </div>
      {/snippet}
    </ReviewContent>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-year-in-review {
    :global(.trakt-review-content) {
      --review-content-height: var(--ni-56);
      flex-direction: row;

      background: linear-gradient(
        178deg,
        var(--shade-920) 43.39%,
        color-mix(in srgb, var(--purple-500) 75%, transparent) 145.02%
      );
    }

    :global(.trakt-review-content-footer) {
      margin-left: auto;
    }

    @include for-tablet-sm-and-below {
      :global(.trakt-review-content-footer) {
        margin-left: 0;
      }

      :global(.trakt-review-content) {
        --review-content-height: var(--ni-192);
        flex-direction: column;

        background: linear-gradient(
          171deg,
          var(--shade-920) 63.39%,
          color-mix(in srgb, var(--purple-500) 75%, transparent) 145.02%
        );
      }
    }
  }

  .trakt-yir-header-container {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
  }

  .trakt-yir-header,
  .trakt-yir-footer {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .title-labels {
    p {
      line-height: var(--font-size-tag);
    }
  }
</style>
