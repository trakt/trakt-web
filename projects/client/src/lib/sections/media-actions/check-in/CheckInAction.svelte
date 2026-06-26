<script lang="ts">
  import CheckInButton from "$lib/components/buttons/check-in/CheckInButton.svelte";
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

  const checkinHandler = async () => {
    await checkin();
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
