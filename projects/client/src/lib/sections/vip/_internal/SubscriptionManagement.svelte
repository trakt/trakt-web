<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { m } from "$lib/features/i18n/messages";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CrownIcon from "./icons/CrownIcon.svelte";
  import { useVip } from "./useVip";

  const { subscription }: { subscription: VipSubscription } = $props();

  const { manageSubscription, cancelSubscription, isFetching } = useVip();

  const onManage = async () => {
    const url = await manageSubscription();
    if (url) {
      globalThis.window.location.href = url;
    }
  };

  const { confirm } = useConfirm();
  const confirmCancel = $derived(
    confirm({
      type: ConfirmationType.CancelVip,
      onConfirm: cancelSubscription,
    }),
  );

  const commonButtonProps = {
    color: "default" as const,
    variant: "primary" as const,
    style: "ghost" as const,
    size: "small" as const,
    disabled: $isFetching,
  };
</script>

<div class="trakt-vip-subscription-management">
  {#if !subscription.renewsAt}
    <Button
      {...commonButtonProps}
      label={m.button_label_renew_vip()}
      href={UrlBuilder.renewVip()}
    >
      {#snippet icon()}
        <CrownIcon />
      {/snippet}
      {m.button_text_renew_vip()}
    </Button>
  {/if}

  {#if subscription.renewsAt}
    <Button
      {...commonButtonProps}
      label={m.button_label_manage_vip()}
      onclick={onManage}
    >
      {#snippet icon()}
        <GearIcon />
      {/snippet}
      {m.button_text_manage_vip()}
    </Button>

    <Button
      {...commonButtonProps}
      label={m.button_label_cancel_vip()}
      onclick={confirmCancel}
    >
      {m.button_text_cancel_vip()}
    </Button>
  {/if}
</div>

<style>
  .trakt-vip-subscription-management {
    display: flex;
    align-items: center;
    justify-content: space-between;

    /* To compensate for the buttons' padding */
    margin-bottom: var(--ni-neg-12);
    margin-left: var(--ni-neg-12);
    margin-right: var(--ni-neg-12);

    :global(.trakt-button) {
      flex-direction: row-reverse;
      gap: var(--gap-xs);

      &[data-style="ghost"] {
        margin: 0;
        transform: none;
      }

      &[data-size="small"] {
        :global(svg) {
          width: var(--ni-16);
          height: var(--ni-16);
        }
      }

      :global(p) {
        font-weight: normal;
      }
    }
  }
</style>
