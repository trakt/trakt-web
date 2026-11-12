<script lang="ts">
  import { initializePromotions } from "$lib/features/promotions/initializePromotions";
  import { useActiveOffer } from "$lib/features/promotions/useActiveOffer";
  import { usePromotion } from "$lib/features/promotions/usePromotion";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import OfferBanner from "./_internal/OfferBanner.svelte";
  import PromotionBanners from "./_internal/PromotionBanners.svelte";
  import ReviewBanners from "./_internal/ReviewBanners.svelte";
  import NudgeBanner from "./nudge/NudgeBanner.svelte";
  import { useWelcomeBanner } from "./welcome/_internal/useWelcomeBanner.ts";
  import WelcomeBanner from "./welcome/WelcomeBanner.svelte";

  $effect.pre(() => initializePromotions());
  const { promotion } = usePromotion();
  const { offer } = useActiveOffer();
  const welcome = useWelcomeBanner();
  const { isVisible: isWelcomeVisible } = welcome;
</script>

<RenderFor audience="authenticated">
  <WelcomeBanner {...welcome} />
</RenderFor>

<RenderFor audience="free">
  {#if !$isWelcomeVisible && !$promotion && !$offer}
    <NudgeBanner />
  {/if}
</RenderFor>

<RenderFor audience="vip">
  <ReviewBanners />
</RenderFor>

{#if $offer}
  <OfferBanner offer={$offer} />
{:else if $promotion}
  <PromotionBanners promotion={$promotion} />
{/if}
