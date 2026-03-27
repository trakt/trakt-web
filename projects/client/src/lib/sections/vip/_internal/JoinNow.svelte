<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { VIP_PLANS } from "./constants";
  import FooterCard from "./FooterCard.svelte";
  import GlassCard from "./GlassCard.svelte";
  import yodaUrl from "./icons/yoda.png";
  import UpgradeButton from "./UpgradeButton.svelte";
  import { useVip } from "./useVip";

  const { plans, elevatedPlanType } = useVip();

  const activePlans = $derived($plans.length > 0 ? $plans : VIP_PLANS);

  const elevatedPlan = $derived(
    activePlans.find((plan) => plan.type === $elevatedPlanType) ??
      activePlans[0],
  );
</script>

<FooterCard>
  {#snippet icon()}
    <VipBadge size="large" />
  {/snippet}

  <p class="trakt-vip-join-now-text">
    {m.text_vip_join_now_tagline()}
  </p>

  <p class="trakt-vip-join-now-text">
    {m.text_vip_join_now()}
  </p>

  <div class="trakt-vip-join-now-bar">
    <GlassCard variant="plain">
      <div class="trakt-vip-join-now-footer">
        <div class="trakt-vip-join-now-label">
          <img src={yodaUrl} alt="" width="33" height="33" />
          <span>{m.text_vip_make_it_official()}</span>
        </div>
        <UpgradeButton plan={elevatedPlan} />
      </div>
    </GlassCard>
  </div>
</FooterCard>

<style>
  .trakt-vip-join-now-text {
    align-self: stretch;
    margin: 0;
  }

  .trakt-vip-join-now-bar {
    align-self: stretch;

    :global(.trakt-vip-glass-card) {
      background: var(--background-vip-glass-card);
      border: var(--ni-1) solid
        color-mix(in srgb, var(--shade-20) 10%, transparent);
    }
  }

  .trakt-vip-join-now-footer {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: var(--gap-s);
  }

  .trakt-vip-join-now-label {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    span {
      color: var(--color-text-primary);
    }
  }
</style>
