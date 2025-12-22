<script lang="ts">
  import type { Promotion } from "$lib/features/promotions/models/Promotion";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import BannerLink from "../../_internal/BannerLink.svelte";
  import DealEnd from "./DealEnd.svelte";

  const { promotion }: { promotion: Promotion } = $props();
</script>

<BannerLink href={UrlBuilder.vip()} target="_blank" source={promotion.id}>
  {#snippet tag()}
    <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
      <DealEnd endDate={promotion.end} />
    </RenderFor>
  {/snippet}

  Claim offer
</BannerLink>
