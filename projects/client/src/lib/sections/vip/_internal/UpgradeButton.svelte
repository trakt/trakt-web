<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Snippet } from "svelte";
  import type { VipPlan } from "./models/VipPlan";
  import { useVip } from "./useVip";

  const {
    plan,
    label,
    children,
  }: { plan: VipPlan; label?: string; children?: Snippet } = $props();

  const planLabel = $derived.by(() => {
    switch (plan.type) {
      case "monthly":
        return m.button_text_vip_continue_monthly();
      case "yearly":
        return m.button_text_vip_continue_yearly();
      case "two_years":
        return m.button_text_vip_claim_deal();
    }
  });

  const { startCheckout, isFetching } = useVip();

  const onStartCheckout = async () => {
    if ($isFetching) return;
    const url = await startCheckout(plan);
    if (url) {
      globalThis.window.location.href = url;
    }
  };
</script>

<trakt-vip-upgrade-button>
  <Button
    size="small"
    label={label ?? planLabel}
    color="custom"
    variant="primary"
    style="flat"
    text="uppercase"
    onclick={onStartCheckout}
    disabled={$isFetching}
  >
    {#if children}
      {@render children()}
    {:else}
      {planLabel}
    {/if}
  </Button>
</trakt-vip-upgrade-button>

<style>
  trakt-vip-upgrade-button {
    :global(.trakt-button) {
      --color-background-custom: var(--purple-500);
      --color-foreground-custom: var(--shade-10);
      --button-height: var(--ni-40);

      border: none;
      transition: background-color var(--transition-duration-short) ease-in-out;
    }
  }
</style>
