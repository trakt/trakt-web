<script lang="ts">
  import { initializePromotions } from "$lib/features/promotions/initializePromotions";
  import { usePromotion } from "$lib/features/promotions/usePromotion";
  import { getMonthKey } from "$lib/utils/date/getMonthKey";
  import { getPreviousMonth } from "$lib/utils/date/getPreviousMonth";
  import { isFirstWeekOfMonth } from "$lib/utils/date/isFirstWeekOfMonth";
  import BannerContainer from "./_internal/BannerContainer.svelte";
  import PromotionBanners from "./_internal/PromotionBanners.svelte";
  import { useBannerDismissal } from "./_internal/useBannerDismissal";
  import { MIR_BANNER_ID } from "./month-in-review/constants";
  import MonthInReview from "./month-in-review/MonthInReview.svelte";

  const now = new Date();

  const { dismiss, isDismissed } = $derived(
    useBannerDismissal(MIR_BANNER_ID, getMonthKey(now)),
  );

  const hasMir = $derived(isFirstWeekOfMonth(now) && !$isDismissed);

  $effect.pre(() => initializePromotions());
  const { promotion } = usePromotion();
</script>

{#if hasMir}
  <BannerContainer>
    <MonthInReview onDismiss={dismiss} month={getPreviousMonth(now)} />
  </BannerContainer>
{/if}

{#if $promotion}
  <PromotionBanners promotion={$promotion} />
{/if}
