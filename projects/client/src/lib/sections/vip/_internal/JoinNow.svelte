<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_PLANS } from "./constants";
  import FooterCard from "./FooterCard.svelte";
  import UpgradeButton from "./UpgradeButton.svelte";

  const cheapestPlan = VIP_PLANS.reduce((cheapest, plan) => {
    return plan.monthlyPrice < cheapest.monthlyPrice ? plan : cheapest;
  }, VIP_PLANS[0]);
</script>

<FooterCard title={m.text_vip_join_now_tagline()}>
  {#snippet icon()}
    <VipBadge size="large" />
  {/snippet}

  <p class="trakt-vip-join-now-description">
    {m.text_vip_join_now()}
  </p>
  <div class="trakt-vip-join-now-footer">
    <h2>
      {m.text_vip_make_it_official()}
    </h2>
    <UpgradeButton plan={cheapestPlan} size="small" />
  </div>
</FooterCard>

<style>
  .trakt-vip-join-now-footer {
    width: 100%;

    display: flex;
    align-items: center;
    gap: var(--gap-s);
    justify-content: space-around;
  }

  .trakt-vip-join-now-description {
    text-align: center;
  }
</style>
