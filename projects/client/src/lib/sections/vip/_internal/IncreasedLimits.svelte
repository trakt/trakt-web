<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { m } from "$lib/features/i18n/messages";
  import FooterCard from "./FooterCard.svelte";
  import IncreasedLimitsIcon from "./icons/IncreasedLimitsIcon.svelte";
  import VipIconCircle from "./VipIconCircle.svelte";
  import UsageLimitsCard from "./UsageLimitsCard.svelte";
  import { mapToUpsellLimits } from "./utils/mapToUpsellLimits";

  const { limits } = useUser();
  const upsellLimits = $derived(mapToUpsellLimits($limits));
</script>

<FooterCard title={m.vip_text_vip_go_beyond_limits()}>
  {#snippet icon()}
    <VipIconCircle className="trakt-limits-icon-circle">
      <IncreasedLimitsIcon />
    </VipIconCircle>
  {/snippet}

  <div class="trakt-vip-limits">
    <UsageLimitsCard items={upsellLimits} isLoading={!$limits} variant="free" />
  </div>
</FooterCard>

<style>
  .trakt-vip-limits {
    align-self: stretch;
  }
</style>
