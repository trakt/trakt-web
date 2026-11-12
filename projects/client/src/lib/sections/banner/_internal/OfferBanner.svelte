<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { PromotionOffer } from "$lib/requests/models/PromotionOffer";
  import { getDayKey } from "$lib/utils/date/getDayKey";
  import { useBannerDismissal } from "../useBannerDismissal.ts";
  import TicketsBanner from "../tickets/TicketsBanner.svelte";
  import BannerContainer from "./BannerContainer.svelte";

  const { offer }: { offer: PromotionOffer } = $props();

  const { dismiss, isDismissed } = $derived(
    useBannerDismissal(offer.id, getDayKey(offer.endsAt)),
  );
</script>

{#snippet banner()}
  {#if !$isDismissed}
    <BannerContainer>
      {#if offer.theme === "tickets"}
        <TicketsBanner onDismiss={dismiss} {offer} />
      {/if}
    </BannerContainer>
  {/if}
{/snippet}

<RenderFor audience="public">
  {@render banner()}
</RenderFor>

<RenderFor audience="free">
  {@render banner()}
</RenderFor>
