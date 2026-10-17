<script lang="ts">
  import { initializePromotions } from "$lib/features/promotions/initializePromotions";
  import { usePromotion } from "$lib/features/promotions/usePromotion";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import PromotionBanners from "./_internal/PromotionBanners.svelte";
  import ReviewBanners from "./_internal/ReviewBanners.svelte";
  import WelcomeBanner from "./welcome/WelcomeBanner.svelte";

  $effect.pre(() => initializePromotions());
  const { promotion } = usePromotion();
</script>

<RenderFor audience="authenticated">
  <WelcomeBanner />
</RenderFor>

<RenderFor audience="vip">
  <ReviewBanners />
</RenderFor>

{#if $promotion}
  <PromotionBanners promotion={$promotion} />
{/if}
