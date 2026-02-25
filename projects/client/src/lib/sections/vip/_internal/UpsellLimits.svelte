<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserLimits } from "$lib/requests/models/UserLimits";
  import UsageLimitsCard from "./UsageLimitsCard.svelte";
  import { mapToUpsellLimits } from "./utils/mapToUpsellLimits";
  import VipContentContainer from "./VipContentContainer.svelte";
  import VipHeader from "./VipHeader.svelte";

  const { limits }: { limits: UserLimits } = $props();

  const upsellLimits = $derived(mapToUpsellLimits(limits));
</script>

<VipContentContainer>
  {#snippet header()}
    <VipHeader>
      Go beyond your limits with <VipBadge />

      {#snippet description()}
        <span class="secondary">{m.text_vip_track_more()}</span>
      {/snippet}
    </VipHeader>
  {/snippet}

  <div class="trakt-vip-upsell-limits">
    <UsageLimitsCard items={upsellLimits} variant="free" />
  </div>
</VipContentContainer>

<style>
  .trakt-vip-upsell-limits {
    max-width: var(--ni-920);
    width: 100%;
  }
</style>
