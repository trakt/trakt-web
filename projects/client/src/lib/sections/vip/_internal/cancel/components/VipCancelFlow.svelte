<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType.ts";
  import { useConfirm } from "$lib/features/confirmation/useConfirm.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { useVip } from "../../useVip.ts";
  import type { VipCancelOutcome } from "../models/VipCancelOutcome.ts";
  import type { VipCancelReason } from "../models/VipCancelReason.ts";
  import type { VipRetentionOffer } from "../models/VipRetentionOffer.ts";
  import { toVipCancelTracking } from "../utils/toVipCancelTracking.ts";
  import ConfirmCard from "./ConfirmCard.svelte";
  import LibraryCard from "./LibraryCard.svelte";
  import OutcomeCard from "./OutcomeCard.svelte";
  import ReasonCard from "./ReasonCard.svelte";
  import type { VipCancelFlowProps } from "./VipCancelFlowProps.ts";

  type VipCancelError = "cancel" | "claim";

  const { summary }: VipCancelFlowProps = $props();

  const { cancelSubscription, claimRetentionOffer, isFetching } = useVip();

  let step = $state(0);
  let reason = $state<VipCancelReason | null>(null);
  let details = $state("");
  let outcome = $state<VipCancelOutcome | null>(null);
  let claimedOffer = $state<VipRetentionOffer | Nil>(null);
  let error = $state<VipCancelError | null>(null);

  const hasLibrary = $derived(
    summary.library.some(({ current, free }) => current > free),
  );
  const total = $derived(hasLibrary ? 3 : 2);
  const libraryIndex = 1;
  const confirmIndex = $derived(total - 1);

  const positionOf = (index: number) => (outcome ? -1 : index - step);
  const next = () => (step = Math.min(step + 1, total - 1));
  const keep = () => (outcome = "kept");

  const cancel = async () => {
    const isCancelled = await cancelSubscription(
      toVipCancelTracking({
        reason,
        details,
        vipMonths: summary.vipMonths,
        offer: summary.offer,
      }),
    );

    if (!isCancelled) {
      error = "cancel";
      return;
    }

    outcome = "cancelled";
  };

  const claim = async () => {
    const isClaimed = await claimRetentionOffer();

    if (!isClaimed) {
      error = "claim";
      return;
    }

    claimedOffer = summary.offer;
    outcome = "claimed";
  };

  const { confirm } = useConfirm();
  const confirmCancel = $derived(
    confirm({
      type: ConfirmationType.CancelVip,
      renewsOn: toHumanDay({ date: summary.endsAt, locale: getLocale() }),
      onConfirm: cancel,
      onCancel: keep,
    }),
  );
</script>

<div class="trakt-vip-cancel-flow">
  <ReasonCard
    position={positionOf(0)}
    {total}
    {reason}
    {details}
    onReason={(value) => (reason = value)}
    onDetails={(value) => (details = value)}
    onContinue={next}
    onKeep={keep}
  />

  {#if hasLibrary}
    <LibraryCard
      position={positionOf(libraryIndex)}
      {total}
      {summary}
      onContinue={next}
      onKeep={keep}
    />
  {/if}

  <ConfirmCard
    position={positionOf(confirmIndex)}
    {total}
    {summary}
    {reason}
    isBusy={$isFetching}
    onCancel={() => confirmCancel()}
    onKeep={keep}
    onClaim={claim}
  />

  {#if outcome}
    <OutcomeCard {outcome} {summary} offer={claimedOffer} />
  {/if}
</div>

<Snackbar
  open={error != null}
  onDismiss={() => (error = null)}
  title={error === "claim"
    ? m.text_vip_cancel_claim_failed_title()
    : m.text_vip_subscription_missing_title()}
  message={error === "claim"
    ? m.text_vip_cancel_claim_failed_message()
    : m.text_vip_subscription_missing_message()}
  variant="error"
/>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-cancel-flow {
    container: vip-cancel / inline-size;
    display: grid;
    width: min(100%, calc(var(--ni-920) + var(--ni-180)));
    min-height: calc(var(--ni-640) - var(--ni-20));
    margin-inline: auto;

    @include for-tablet-sm-and-below {
      min-height: calc(
        100dvh - var(--ni-180) - var(--mobile-navbar-height)
      );
    }
  }
</style>
