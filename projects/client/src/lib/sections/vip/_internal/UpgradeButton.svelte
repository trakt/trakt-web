<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipPlan } from "./models/VipPlan";
  import { useVip } from "./useVip";

  const {
    plan,
    size = "normal",
  }: { plan: VipPlan; size?: "normal" | "small" } = $props();

  const { startCheckout, isFetching } = useVip();

  const onStartCheckout = async () => {
    const url = await startCheckout(plan);
    if (url) {
      globalThis.window.location.href = url;
    }
  };
</script>

<trakt-vip-upgrade-button>
  <Button
    {size}
    onclick={onStartCheckout}
    disabled={$isFetching}
    label={m.button_label_vip_upgrade()}
    color="custom"
    variant="primary"
    style="flat"
  >
    {m.button_text_vip_upgrade()}
  </Button>
</trakt-vip-upgrade-button>

<style>
  trakt-vip-upgrade-button {
    :global(.trakt-button) {
      --color-background-custom: color-mix(
        in srgb,
        var(--red-950) 25%,
        transparent
      );
      --color-foreground-custom: var(--shade-10);

      border: var(--ni-1) solid
        color-mix(in srgb, var(--red-500) 75%, transparent);
      padding: var(--ni-16) var(--ni-32);

      &:hover {
        --color-background-custom: var(--shade-10);
        --color-foreground-custom: var(--red-600);
      }
    }
  }
</style>
