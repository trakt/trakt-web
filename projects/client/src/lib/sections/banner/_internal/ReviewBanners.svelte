<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
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
  {#snippet monthInReview()}
    <BannerContainer>
      <MonthInReview
        onDismiss={$mir.dismiss}
        month={$mir.month}
        hiddenUntil={$mir.hiddenUntil}
      />
    </BannerContainer>
  {/snippet}

  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    {@render monthInReview()}
  </RenderFor>

  <RenderFor audience="all" device={["tablet-lg", "desktop"]} input={["touch"]}>
    {@render monthInReview()}
  </RenderFor>
{/if}
