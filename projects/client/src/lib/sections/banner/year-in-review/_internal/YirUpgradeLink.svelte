<script lang="ts">
  import type { Promotion } from "$lib/features/promotions/models/Promotion";
  import { toPromotionUpsellSource } from "$lib/features/upsell/toPromotionUpsellSource";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import BannerLink from "../../_internal/BannerLink.svelte";

  const { promotion, startDate }: { promotion: Promotion; startDate: Date } =
    $props();

  const year = $derived(startDate.getFullYear());
  const upsellSource = $derived(toPromotionUpsellSource(promotion));
</script>

<BannerLink href={UrlBuilder.vip(upsellSource)} {upsellSource}>
  Get VIP & reveal your {year}
</BannerLink>
