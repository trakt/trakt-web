<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { VipPlan } from "./models/VipPlan";
  import { useVip } from "./useVip";

  const { plan }: { plan: VipPlan } = $props();

  const { startCheckout, isFetching } = useVip();

  const onStartCheckout = async () => {
    if (!plan) return;
    const url = await startCheckout(plan);
    if (url) {
      globalThis.window.location.href = url;
    }
  };
</script>

<trakt-vip-upgrade-button>
  <Button
    size="small"
    label={m.button_label_vip_upgrade()}
    color="custom"
    variant="primary"
    style="flat"
    text="uppercase"
    onclick={onStartCheckout}
    disabled={$isFetching}
  >
    {m.button_text_vip_upgrade()}
  </Button>
</trakt-vip-upgrade-button>

<style>
  trakt-vip-upgrade-button {
    :global(.trakt-button) {
      --color-background-custom: var(--red-500);
      --color-foreground-custom: var(--shade-10);
      --button-height: var(--ni-40);

      border: none;
      transition: background-color var(--transition-duration-short) ease-in-out;
    }
  }
</style>
