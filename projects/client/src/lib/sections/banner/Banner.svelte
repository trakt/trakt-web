<script lang="ts">
  import { initializePromotions } from "$lib/features/promotions/initializePromotions";
  import { usePromotion } from "$lib/features/promotions/usePromotion";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import PromotionBanners from "./_internal/PromotionBanners.svelte";
  import ReviewBanners from "./_internal/ReviewBanners.svelte";
  import NudgeBanner from "./nudge/NudgeBanner.svelte";
  import { useWelcomeBanner } from "./welcome/_internal/useWelcomeBanner.ts";
  import WelcomeBanner from "./welcome/WelcomeBanner.svelte";

  $effect.pre(() => initializePromotions());
  const { promotion } = usePromotion();
  const welcome = useWelcomeBanner();
  const { isVisible: isWelcomeVisible } = welcome;
</script>

<RenderFor audience="authenticated">
  <WelcomeBanner {...welcome} />
</RenderFor>

<RenderFor audience="free">
  {#if !$isWelcomeVisible && !$promotion}
    <NudgeBanner />
  {/if}
</RenderFor>

<RenderFor audience="vip">
  <ReviewBanners />
</RenderFor>

{#if $promotion}
  <PromotionBanners promotion={$promotion} />
{/if}
