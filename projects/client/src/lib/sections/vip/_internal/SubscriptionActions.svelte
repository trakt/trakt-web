<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import SkullIcon from "$lib/components/icons/SkullIcon.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { m } from "$lib/features/i18n/messages";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CrownIcon from "./icons/CrownIcon.svelte";
  import { useVip } from "./useVip";

  type SubscriptionFailure = "missing" | "manage";

  const { subscription }: { subscription: VipSubscription | Nil } = $props();

  const { manageSubscription, isFetching } = useVip();
  const { track } = useTrack(AnalyticsEvent.VipManage);
  const { user } = useUser();

  const isStripe = $derived(subscription?.gateway === "stripe");

  let failure = $state<SubscriptionFailure | null>(null);

  function toFailureCopy(kind: SubscriptionFailure | null) {
    if (kind === "missing") {
      return {
        title: m.text_vip_subscription_missing_title(),
        message: m.text_vip_subscription_missing_message(),
      };
    }

    return {
      title: m.text_vip_manage_failed_title(),
      message: m.text_vip_subscription_failed_message(),
    };
  }

  const failureCopy = $derived(toFailureCopy(failure));

  async function reportFailure<T>(
    request: () => Promise<T>,
    kind: SubscriptionFailure,
  ): Promise<T> {
    try {
      return await request();
    } catch (error) {
      failure = kind;
      throw error;
    }
  }

  const onManage = async () => {
    const result = await reportFailure(manageSubscription, "manage");

    if (result.kind === "redirect") {
      globalThis.window.location.href = result.url;
      return;
    }

    failure = result.kind === "missing-subscription" ? "missing" : "manage";
  };
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
        onclick={onManage}
        label={m.button_label_manage_vip()}
      >
        {m.button_text_manage_vip()}
        {#snippet icon()}
          <RenameIcon />
        {/snippet}
      </DropdownItem>
    {:else if subscription?.renewsAt && subscription?.manageUrl}
      <DropdownItem
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
    {/if}
    {#if subscription?.renewsAt}
      <DropdownItem
        href={UrlBuilder.vipCancel()}
        color="red"
        label={m.button_label_cancel_vip()}
      >
        {m.button_text_cancel_vip()}
        {#snippet icon()}
          <SkullIcon />
        {/snippet}
      </DropdownItem>
    {:else}
      <DropdownItem
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

<Snackbar
  open={failure !== null}
  onDismiss={() => (failure = null)}
  title={failureCopy.title}
  message={failureCopy.message}
  href={UrlBuilder.og.support($user?.slug)}
  variant="error"
/>
