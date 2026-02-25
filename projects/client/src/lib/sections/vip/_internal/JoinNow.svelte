<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_PLANS } from "./constants";
  import PostersBackground from "./PostersBackground.svelte";
  import UpgradeButton from "./UpgradeButton.svelte";

  const cheapestPlan = VIP_PLANS.reduce((cheapest, plan) => {
    return plan.monthlyPrice < cheapest.monthlyPrice ? plan : cheapest;
  }, VIP_PLANS[0]);
</script>

<div class="trakt-vip-join-now">
  <PostersBackground type="movie" />
  <VipBadge />
  <h2 class="bold">
    {m.text_vip_join_now()}
  </h2>
  <UpgradeButton plan={cheapestPlan} />
</div>

<style>
  .trakt-vip-join-now {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    gap: var(--gap-l);

    position: relative;
    overflow: hidden;

    text-align: center;

    padding: var(--ni-24);

    border-radius: var(--border-radius-m);
    border: var(--ni-1) solid var(--red-700);

    :global(.trakt-vip-badge) {
      transform: scale(1.5);
      transform-origin: center;
    }
  }
</style>
