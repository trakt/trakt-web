<script lang="ts">
  import CheckInButton from "$lib/components/buttons/check-in/CheckInButton.svelte";
  import type { CheckInActionProps } from "./CheckInActionProps.ts";
  import { useCheckIn } from "./useCheckIn.ts";

  const {
    style = "action",
    size = "normal",
    title,
    variant,
    ...target
  }: CheckInActionProps = $props();

  const { isCheckingIn, isCheckedIn, checkin, isWatchable } = $derived(
    useCheckIn(target),
  );
</script>

{#if isWatchable}
  <CheckInButton
    {style}
    {title}
    {size}
    {variant}
    isCheckedIn={$isCheckedIn}
    isCheckingIn={$isCheckingIn}
    {checkin}
  />
{/if}
