<script lang="ts">
  import MonthInReview from "../month-in-review/MonthInReview.svelte";
  import YearInReview from "../year-in-review/YearInReview.svelte";
  import BannerContainer from "./BannerContainer.svelte";
  import { useReviewBanners } from "./useReviewBanners";

  const now = new Date();
  const { yir, mir } = useReviewBanners(now);
</script>

{#if $yir.isVisible}
  <BannerContainer>
    <YearInReview onDismiss={$yir.dismiss} year={$yir.year} />
  </BannerContainer>
{/if}

{#if $mir.isVisible}
  <BannerContainer>
    <MonthInReview onDismiss={$mir.dismiss} month={$mir.month} />
  </BannerContainer>
{/if}
