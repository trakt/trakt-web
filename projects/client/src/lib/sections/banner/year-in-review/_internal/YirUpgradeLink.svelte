<script lang="ts">
  import type { Promotion } from "$lib/features/promotions/models/Promotion";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import BannerLink from "../../_internal/BannerLink.svelte";

  const { promotion, startDate }: { promotion: Promotion; startDate: Date } =
    $props();

  const year = $derived(startDate.getFullYear());
</script>

<BannerLink href={UrlBuilder.vip()} source={promotion.id}>
  Get VIP & reveal your {year}
</BannerLink>
