<script lang="ts">
  import type { Promotion } from "$lib/features/promotions/models/Promotion";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { getDayKey } from "$lib/utils/date/getDayKey";
  import BlackFriday from "./../black-friday/BlackFriday.svelte";
  import BannerContainer from "./BannerContainer.svelte";
  import { useBannerDismissal } from "./useBannerDismissal";

  const { promotion }: { promotion: Promotion } = $props();

  const { dismiss, isDismissed } = $derived(
    useBannerDismissal(promotion.id, getDayKey(promotion.end)),
  );
</script>

<RenderFor audience={promotion.audience}>
  {#if !$isDismissed}
    <BannerContainer>
      {#if promotion.id === "black-friday"}
        <BlackFriday onDismiss={dismiss} {promotion} />
      {/if}
    </BannerContainer>
  {/if}
</RenderFor>
