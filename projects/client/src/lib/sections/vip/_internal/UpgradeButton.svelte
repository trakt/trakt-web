<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { VipUpsellSource } from "$lib/features/upsell/models/VipUpsellSource";
  import type { Snippet } from "svelte";
  import type { VipPlan } from "./models/VipPlan";
  import { useVip } from "./useVip";
  import { toVipFailureCode } from "./utils/toVipFailureCode";

  const {
    plan,
    label,
    children,
    highlighted = true,
    source,
  }: {
    plan: VipPlan;
    label?: string;
    children?: Snippet;
    highlighted?: boolean;
    source?: VipUpsellSource;
  } = $props();

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

  let failure = $state<"offer_ended" | "failed" | null>(null);

  const onStartCheckout = async () => {
    if ($isFetching) return;
    failure = null;
    const url = await startCheckout(plan, source).catch((error: unknown) => {
      failure =
        toVipFailureCode(error) === "http_409" ? "offer_ended" : "failed";
      return null;
    });
    if (!url) {
      failure ??= "failed";
      return;
    }

    globalThis.window.location.href = url;
  };
</script>

<trakt-vip-upgrade-button data-highlighted={highlighted}>
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
  open={failure === "failed"}
  onDismiss={() => (failure = null)}
  title={m.text_vip_checkout_failed_title()}
  message={m.text_vip_subscription_failed_message()}
  href={UrlBuilder.og.support($user?.slug)}
  variant="error"
/>

<Snackbar
  open={failure === "offer_ended"}
  onDismiss={() => (failure = null)}
  title={m.text_vip_offer_ended_title()}
  message={m.text_vip_offer_ended_message()}
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

    &[data-highlighted="false"] :global(.trakt-button) {
      --color-background-custom: color-mix(
        in srgb,
        var(--color-foreground) 8%,
        var(--color-vip-plan-surface)
      );
      --color-foreground-custom: var(--color-text-primary);

      backdrop-filter: blur(var(--ni-10));
    }
  }
</style>
