<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_PLANS } from "./constants";
  import GlassCard from "./GlassCard.svelte";
  import UpgradeButton from "./UpgradeButton.svelte";

  const cheapestPlan = VIP_PLANS.reduce((cheapest, plan) => {
    return plan.monthlyPrice < cheapest.monthlyPrice ? plan : cheapest;
  }, VIP_PLANS[0]);
</script>

<GlassCard>
  <div class="trakt-vip-join-now">
    <VipBadge />
    <p>
      {m.text_vip_join_now()}
    </p>
    <h2>
      {m.text_vip_make_it_official()}
    </h2>
    <UpgradeButton plan={cheapestPlan} />
  </div>
</GlassCard>

<style>
  .trakt-vip-join-now {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: var(--gap-l);

    text-align: center;

    :global(.trakt-vip-badge) {
      transform: scale(1.5);
      transform-origin: center;
    }
  }
</style>
