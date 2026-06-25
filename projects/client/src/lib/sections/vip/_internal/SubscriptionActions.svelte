<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import SkullIcon from "$lib/components/icons/SkullIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import { getLocale } from "$lib/features/i18n";
  import { m } from "$lib/features/i18n/messages";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CrownIcon from "./icons/CrownIcon.svelte";
  import { useVip } from "./useVip";

  const { subscription }: { subscription: VipSubscription | Nil } = $props();

  const { manageSubscription, cancelSubscription, isFetching } = useVip();
  const { track } = useTrack(AnalyticsEvent.VipManage);

  const isStripe = $derived(subscription?.gateway === "stripe");

  const onManage = async () => {
    track();
    const url = await manageSubscription();
    if (url) {
      globalThis.window.location.href = url;
    }
  };

  const renewsOn = $derived(
    toHumanDay({
      date: subscription?.renewsAt ?? subscription?.expiresAt ?? new Date(),
      locale: getLocale(),
    }),
  );

  const { confirm } = useConfirm();
  const confirmCancel = $derived(
    confirm({
      type: ConfirmationType.CancelVip,
      renewsOn,
      onConfirm: cancelSubscription,
    }),
  );
</script>

<PopupMenu
  label={m.button_text_manage_subscription()}
  mode="standalone"
  size="small"
  title={m.button_text_manage_subscription()}
  disabled={!subscription}
>
  {#snippet icon()}
    <GearIcon />
  {/snippet}
  {#snippet items()}
    {#if subscription?.renewsAt && isStripe}
      <DropdownItem
        disabled={$isFetching}
        style="flat"
        color="default"
        variant="secondary"
        onclick={onManage}
        label={m.button_label_manage_vip()}
      >
        {m.button_text_manage_vip()}
        {#snippet icon()}
          <RenameIcon />
        {/snippet}
      </DropdownItem>
      <DropdownItem
        disabled={$isFetching}
        style="flat"
        color="red"
        onclick={confirmCancel}
        label={m.button_label_cancel_vip()}
      >
        {m.button_text_cancel_vip()}
        {#snippet icon()}
          <SkullIcon />
        {/snippet}
      </DropdownItem>
    {:else if subscription?.renewsAt && subscription?.manageUrl}
      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        href={subscription.manageUrl}
        target="_blank"
        onclick={() => track()}
        label={m.button_label_manage_vip()}
      >
        {m.button_text_manage_vip()}
        {#snippet icon()}
          <RenameIcon />
        {/snippet}
      </DropdownItem>
    {:else if !subscription?.renewsAt}
      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        href={UrlBuilder.renewVip()}
        label={m.button_label_renew_vip()}
      >
        {m.button_text_renew_vip()}
        {#snippet icon()}
          <CrownIcon />
        {/snippet}
      </DropdownItem>
    {/if}
  {/snippet}
</PopupMenu>
