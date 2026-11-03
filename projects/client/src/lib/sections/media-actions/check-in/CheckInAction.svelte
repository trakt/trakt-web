<script lang="ts">
  import CheckInButton from "$lib/components/buttons/check-in/CheckInButton.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CheckInActionProps } from "./CheckInActionProps.ts";
  import { useCheckIn } from "./useCheckIn.ts";

  const {
    style = "action",
    size = "normal",
    title,
    variant,
    disabled = false,
    onCheckIn,
    ...target
  }: CheckInActionProps = $props();

  const { isCheckingIn, isCheckedIn, checkin, isWatchable } = $derived(
    useCheckIn(target),
  );

  let hasFailed = $state(false);

  const checkinHandler = async () => {
    const hasCheckedIn = await checkin()
      .then(() => true)
      .catch(() => false);

    if (!hasCheckedIn) {
      hasFailed = true;
      return;
    }

    onCheckIn?.();
  };
</script>

{#if isWatchable}
  <CheckInButton
    {style}
    {title}
    {size}
    {variant}
    {disabled}
    isCheckedIn={$isCheckedIn}
    isCheckingIn={$isCheckingIn}
    checkin={checkinHandler}
  />
{/if}

<Snackbar
  open={hasFailed}
  onDismiss={() => (hasFailed = false)}
  title={m.text_checkin_failed_title()}
  message={m.text_checkin_failed_message()}
  variant="error"
/>
