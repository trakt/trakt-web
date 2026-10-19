<script lang="ts">
  import type { Promotion } from "$lib/features/promotions/models/Promotion";
  import { toPromotionUpsellSource } from "$lib/features/upsell/toPromotionUpsellSource";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import BannerLink from "../../_internal/BannerLink.svelte";
  import DealEnd from "./DealEnd.svelte";

  const { promotion }: { promotion: Promotion } = $props();

  const upsellSource = $derived(toPromotionUpsellSource(promotion));
</script>

<BannerLink href={UrlBuilder.vip(upsellSource)} {upsellSource}>
  {#snippet tag()}
    <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
      <DealEnd endDate={promotion.end} />
    </RenderFor>
  {/snippet}

  Claim offer
</BannerLink>
