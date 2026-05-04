<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { m } from "$lib/features/i18n/messages";
  import FooterCard from "./FooterCard.svelte";
  import IncreasedLimitsIcon from "./icons/IncreasedLimitsIcon.svelte";
  import UsageLimitsCard from "./UsageLimitsCard.svelte";
  import { mapToUpsellLimits } from "./utils/mapToUpsellLimits";

  const { limits } = useUser();
  const upsellLimits = $derived(mapToUpsellLimits($limits));
</script>

<FooterCard title={m.vip_text_vip_go_beyond_limits()}>
  {#snippet icon()}
    <div class="trakt-limits-icon-circle">
      <IncreasedLimitsIcon />
    </div>
  {/snippet}

  <div class="trakt-vip-limits">
    <UsageLimitsCard items={upsellLimits} isLoading={!$limits} variant="free" />
  </div>
</FooterCard>

<style>
  .trakt-limits-icon-circle {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-48);
    height: var(--ni-48);

    background: var(--shade-10);
    border-radius: 50%;
  }

  .trakt-vip-limits {
    align-self: stretch;
  }
</style>
