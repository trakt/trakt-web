<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
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
  const { user } = useUser();

  let hasFailed = $state(false);

  const onStartCheckout = async () => {
    if ($isFetching) return;
    const url = await startCheckout(plan).catch(() => null);
    if (!url) {
      hasFailed = true;
      return;
    }

    globalThis.window.location.href = url;
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

<Snackbar
  open={hasFailed}
  onDismiss={() => (hasFailed = false)}
  title={m.text_vip_checkout_failed_title()}
  message={m.text_vip_subscription_failed_message()}
  href={UrlBuilder.og.support($user?.slug)}
  variant="error"
/>

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
